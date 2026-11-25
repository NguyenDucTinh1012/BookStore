import { getBooks } from '../../books/api/booksApi.js'
import { getCategories } from '../../categories/api/categoriesApi.js'
import { getOrderDetails } from '../../orderDetails/api/orderDetailsApi.js'
import { getOrders } from '../../orders/api/ordersApi.js'

export async function getReportData() {
  const [orders, orderDetails, books, categories] = await Promise.all([
    getOrders(),
    getOrderDetails(),
    getBooks(),
    getCategories(),
  ])

  return { orders, orderDetails, books, categories }
}
