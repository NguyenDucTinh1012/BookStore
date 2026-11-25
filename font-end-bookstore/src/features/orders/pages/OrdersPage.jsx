import { useEffect, useMemo, useState } from 'react'
import Icon from '../../../components/ui/Icon.jsx'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { getOrders, updateOrderStatus } from '../api/ordersApi.js'
import OrderDetailsModal from '../components/OrderDetailsModal.jsx'
import OrderStats from '../components/OrderStats.jsx'
import OrdersTable from '../components/OrdersTable.jsx'
import '../orders.css'

const PAGE_SIZE = 7

export default function OrdersPage({ onToast }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [savingStatus, setSavingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')

  async function reloadOrders() {
    setLoading(true)
    setLoadError('')
    try {
      setOrders(await getOrders())
    } catch (error) {
      setLoadError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isCurrent = true
    getOrders()
      .then((items) => { if (isCurrent) setOrders(items) })
      .catch((error) => { if (isCurrent) setLoadError(getApiErrorMessage(error)) })
      .finally(() => { if (isCurrent) setLoading(false) })
    return () => { isCurrent = false }
  }, [])

  const filteredOrders = useMemo(() => orders
    .filter((order) => {
      const searchText = `${order.orderId || ''} ${order.receiverName || ''} ${order.phone || ''} ${order.address || ''} ${order.userId || ''}`.toLocaleLowerCase('vi')
      const matchesQuery = searchText.includes(query.toLocaleLowerCase('vi'))
      const matchesStatus = status === 'all' || String(order.status) === status
      return matchesQuery && matchesStatus
    })
    .sort((first, second) => new Date(second.orderDate) - new Date(first.orderDate)), [orders, query, status])

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const visibleOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openOrder(order) {
    setSelectedOrder(order)
    setStatusError('')
  }

  function closeOrder() {
    if (!savingStatus) {
      setSelectedOrder(null)
      setStatusError('')
    }
  }

  async function handleStatusUpdate(order, nextStatus) {
    setSavingStatus(true)
    setStatusError('')
    try {
      await updateOrderStatus(order.orderId, nextStatus)
      const updatedOrder = { ...order, status: nextStatus }
      setOrders((current) => current.map((item) => item.orderId === order.orderId ? updatedOrder : item))
      setSelectedOrder(updatedOrder)
      onToast(`Đã cập nhật trạng thái đơn #${String(order.orderId).padStart(6, '0')}.`)
      return true
    } catch (error) {
      setStatusError(getApiErrorMessage(error))
      return false
    } finally {
      setSavingStatus(false)
    }
  }

  return (
    <main className="page-content" id="orders">
      <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> QUẢN LÝ BÁN HÀNG</div><h1>Đơn hàng</h1><p className="page-subtitle">Theo dõi thông tin nhận hàng, sản phẩm và tiến độ xử lý.</p></div><button className="secondary-button order-refresh-button" onClick={reloadOrders} disabled={loading}><Icon name="clock" size={16}/> {loading ? 'Đang tải…' : 'Làm mới'}</button></section>
      <OrderStats orders={orders} loading={loading}/>
      <OrdersTable
        orders={visibleOrders}
        loading={loading}
        error={loadError}
        query={query}
        status={status}
        page={page}
        pageCount={pageCount}
        total={filteredOrders.length}
        onQueryChange={(value) => { setQuery(value); setPage(1) }}
        onStatusChange={(value) => { setStatus(value); setPage(1) }}
        onPageChange={setPage}
        onRetry={reloadOrders}
        onOpen={openOrder}
        onUpdateStatus={openOrder}
      />
      <footer className="page-footer"><span>© {new Date().getFullYear()} BookStore · Quản trị</span><span>Đơn hàng được đồng bộ từ backend <b>♥</b></span></footer>
      {selectedOrder && <OrderDetailsModal key={`${selectedOrder.orderId}-${selectedOrder.status}`} order={selectedOrder} saving={savingStatus} error={statusError} onClose={closeOrder} onUpdateStatus={handleStatusUpdate}/>}
    </main>
  )
}
