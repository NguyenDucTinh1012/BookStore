import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js'
import OrderStatusBadge from './OrderStatusBadge.jsx'
import { getOrderStatus } from '../utils/orderStatus.js'

const statusOptions = [0, 1, 2, 3, 4]

function LoadingRows() {
  return Array.from({ length: 5 }, (_, index) => <tr className="skeleton-row" key={index}><td><i className="skeleton-medium"/></td><td><i className="skeleton-long"/></td><td><i className="skeleton-short"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-short"/></td><td><i className="skeleton-short"/></td></tr>)
}

function OrderRow({ order, onOpen, onUpdateStatus }) {
  const itemCount = (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  const isTerminal = order.status === 3 || order.status === 4
  return (
    <tr className="category-row">
      <td><button className="order-number" onClick={() => onOpen(order)}>#{String(order.orderId).padStart(6, '0')}</button><small className="order-created">{formatDate(order.orderDate)}</small></td>
      <td><div className="order-customer"><b>{order.receiverName || '—'}</b><small>{order.phone || 'Chưa có số điện thoại'}</small></div></td>
      <td><div className="order-item-summary"><b>{itemCount} cuốn</b><small>{order.items?.length || 0} dòng sản phẩm</small></div></td>
      <td><b className="book-price">{formatCurrency(order.totalAmount)}</b></td>
      <td><OrderStatusBadge status={order.status}/></td>
      <td><div className="order-actions"><button className="order-detail-button" onClick={() => onOpen(order)}>Chi tiết</button><button className="row-action-button" aria-label={isTerminal ? 'Đơn đã kết thúc' : 'Cập nhật trạng thái'} title={isTerminal ? 'Không thể cập nhật đơn đã kết thúc' : 'Cập nhật trạng thái'} disabled={isTerminal} onClick={() => onUpdateStatus(order)}><Icon name="edit" size={16}/></button></div></td>
    </tr>
  )
}

function EmptyState({ hasFilters }) {
  return <div className="empty-state"><span><Icon name="shopping" size={25}/></span><h3>{hasFilters ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng'}</h3><p>{hasFilters ? 'Thử đổi từ khóa hoặc trạng thái lọc.' : 'Khi khách đặt sách, đơn hàng sẽ xuất hiện tại đây.'}</p></div>
}

function exportOrders(orders) {
  const rows = [
    ['Mã đơn', 'Người nhận', 'Điện thoại', 'Địa chỉ', 'Ngày đặt', 'Tổng tiền', 'Trạng thái'],
    ...orders.map((order) => [order.orderId, order.receiverName, order.phone, order.address, order.orderDate, order.totalAmount, getOrderStatus(order.status).label]),
  ]
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'don-hang-bookstore.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export default function OrdersTable({
  orders, loading, error, query, status, page, pageCount, total,
  onQueryChange, onStatusChange, onPageChange, onRetry, onOpen, onUpdateStatus,
}) {
  const firstItem = total ? (page - 1) * 7 + 1 : 0
  const lastItem = Math.min(page * 7, total)
  const hasFilters = Boolean(query) || status !== 'all'

  return (
    <section className="table-panel">
      <div className="table-heading"><div><h2>Tất cả đơn hàng <span className="heading-count">{loading ? '…' : total}</span></h2><p>Thông tin nhận hàng, mặt hàng, tổng tiền và trạng thái từ bảng Orders.</p></div><button className="export-button" onClick={() => exportOrders(orders)}><span>↓</span> Xuất dữ liệu</button></div>
      <div className="table-toolbar"><label className="search-box"><Icon name="search"/><input aria-label="Tìm đơn hàng" placeholder="Tìm mã đơn, người nhận, số điện thoại..." value={query} onChange={(event) => onQueryChange(event.target.value)}/></label><label className="filter-select"><Icon name="filter"/><select aria-label="Lọc trạng thái đơn hàng" value={status} onChange={(event) => onStatusChange(event.target.value)}><option value="all">Tất cả trạng thái</option>{statusOptions.map((value) => <option key={value} value={value}>{getOrderStatus(value).label}</option>)}</select><Icon name="down" size={15}/></label></div>
      {error ? <div className="error-state"><div className="error-symbol">!</div><h3>Chưa thể tải đơn hàng</h3><p>{error}</p><button className="secondary-button" onClick={onRetry}>Thử tải lại</button></div> : <>
        <div className="table-scroll"><table className="category-table orders-table"><thead><tr><th>MÃ ĐƠN / NGÀY ĐẶT</th><th>NGƯỜI NHẬN</th><th>SẢN PHẨM</th><th>TỔNG TIỀN</th><th>TRẠNG THÁI</th><th className="actions-heading">THAO TÁC</th></tr></thead><tbody>
          {loading ? <LoadingRows/> : orders.map((order) => <OrderRow key={order.orderId} order={order} onOpen={onOpen} onUpdateStatus={onUpdateStatus}/>)}
          {!loading && orders.length === 0 && <tr><td colSpan="6"><EmptyState hasFilters={hasFilters}/></td></tr>}
        </tbody></table></div>
        <div className="table-footer"><span>Hiển thị <b>{firstItem}–{lastItem}</b> trong <b>{total}</b> đơn hàng</span><div className="pagination"><button aria-label="Trang trước" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button key={index} className={page === index + 1 ? 'page-current' : ''} onClick={() => onPageChange(index + 1)}>{index + 1}</button>)}<button aria-label="Trang sau" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>›</button></div></div>
      </>}
    </section>
  )
}
