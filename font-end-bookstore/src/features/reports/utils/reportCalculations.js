export const ORDER_STATUS_VALUES = [0, 1, 2, 3, 4]

export function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getPresetRange(preset, today = new Date()) {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let start

  if (preset === '7days') {
    start = new Date(end)
    start.setDate(start.getDate() - 6)
  } else if (preset === 'year') {
    start = new Date(end.getFullYear(), 0, 1)
  } else {
    start = new Date(end)
    start.setDate(start.getDate() - 29)
  }

  return { startDate: toDateInputValue(start), endDate: toDateInputValue(end) }
}

export function isInDateRange(dateValue, startDate, endDate) {
  if (!dateValue) return false
  const date = String(dateValue).slice(0, 10)
  return date >= startDate && date <= endDate
}

function dateKey(date) {
  return toDateInputValue(date)
}

export function buildRevenueSeries(orders, startDate, endDate) {
  if (!startDate || !endDate || startDate > endDate) return { unit: 'day', items: [] }

  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const spanDays = Math.floor((end - start) / 86400000) + 1
  const daily = spanDays <= 45
  const buckets = new Map()

  if (daily) {
    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      const key = dateKey(cursor)
      buckets.set(key, { key, label: new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short' }).format(cursor), amount: 0, orderCount: 0 })
    }
  } else {
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1)
    while (cursor <= lastMonth) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
      buckets.set(key, { key, label: new Intl.DateTimeFormat('vi-VN', { month: 'short', year: '2-digit' }).format(cursor), amount: 0, orderCount: 0 })
      cursor.setMonth(cursor.getMonth() + 1)
    }
  }

  for (const order of orders) {
    if (order.status !== 3 || !isInDateRange(order.orderDate, startDate, endDate)) continue
    const day = String(order.orderDate).slice(0, 10)
    const key = daily ? day : day.slice(0, 7)
    const bucket = buckets.get(key)
    if (!bucket) continue
    bucket.amount += Number(order.totalAmount || 0)
    bucket.orderCount += 1
  }

  return { unit: daily ? 'day' : 'month', items: [...buckets.values()] }
}

export function calculateReport(data, startDate, endDate) {
  const ordersInRange = data.orders.filter((order) => isInDateRange(order.orderDate, startDate, endDate))
  const completedOrders = ordersInRange.filter((order) => order.status === 3)
  const completedRevenue = completedOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)
  const orderDetailsInRange = data.orderDetails.filter((detail) => isInDateRange(detail.orderDate, startDate, endDate))
  const nonCancelledDetails = orderDetailsInRange.filter((detail) => detail.orderStatus !== 4)

  const bookSales = new Map()
  for (const detail of nonCancelledDetails) {
    const key = detail.bookId
    const current = bookSales.get(key) || {
      bookId: detail.bookId,
      title: detail.bookTitle || `Sách #${detail.bookId}`,
      author: detail.author || '',
      quantity: 0,
      amount: 0,
    }
    current.quantity += Number(detail.quantity || 0)
    current.amount += Number(detail.subTotal ?? (Number(detail.quantity || 0) * Number(detail.unitPrice || 0)))
    bookSales.set(key, current)
  }

  const booksById = new Map(data.books.map((book) => [book.bookId, book]))
  const categoriesById = new Map(data.categories.map((category) => [category.categoryId, category]))
  const categorySales = new Map()

  for (const detail of nonCancelledDetails) {
    const book = booksById.get(detail.bookId)
    const categoryId = book?.categoryId ?? null
    const category = categoriesById.get(categoryId)
    const key = categoryId ?? 'unassigned'
    const current = categorySales.get(key) || {
      categoryId,
      name: category?.categoryName || book?.categoryName || 'Chưa phân loại',
      quantity: 0,
      amount: 0,
    }
    current.quantity += Number(detail.quantity || 0)
    current.amount += Number(detail.subTotal ?? (Number(detail.quantity || 0) * Number(detail.unitPrice || 0)))
    categorySales.set(key, current)
  }

  const statusCounts = new Map(ORDER_STATUS_VALUES.map((status) => [status, ordersInRange.filter((order) => order.status === status).length]))
  const revenueSeries = buildRevenueSeries(ordersInRange, startDate, endDate)

  return {
    ordersInRange,
    completedOrders,
    completedRevenue,
    averageCompletedOrder: completedOrders.length ? completedRevenue / completedOrders.length : 0,
    cancelledCount: statusCounts.get(4),
    statusCounts,
    revenueSeries,
    topBooks: [...bookSales.values()].sort((a, b) => b.quantity - a.quantity || b.amount - a.amount).slice(0, 5),
    categorySales: [...categorySales.values()].sort((a, b) => b.quantity - a.quantity || b.amount - a.amount).slice(0, 6),
    orderDetailsInRange,
    nonCancelledDetails,
  }
}
