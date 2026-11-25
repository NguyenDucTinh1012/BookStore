import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js'
import { getOrderStatus } from '../../orders/utils/orderStatus.js'
import OrderStatusBadge from '../../orders/components/OrderStatusBadge.jsx'

function LoadingRows() {
  return Array.from({ length: 5 }, (_, index) => <tr className="skeleton-row" key={index}><td><i className="skeleton-short"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-long"/></td><td><i className="skeleton-short"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-short"/></td></tr>)
}

function DetailRow({ detail, index, onOpen }) {
  const subTotal = detail.subTotal ?? Number(detail.quantity || 0) * Number(detail.unitPrice || 0)
  return (
    <tr className="category-row" style={{ '--row-index': index }}>
      <td><button className="order-number" onClick={() => onOpen(detail)}>#{String(detail.orderDetailId).padStart(6, '0')}</button></td>
      <td><button className="order-number order-reference" onClick={() => onOpen(detail)}>#{String(detail.orderId).padStart(6, '0')}</button><small className="order-created">{formatDate(detail.orderDate)}</small></td>
      <td><div className="detail-book-cell"><span className="detail-book-icon"><Icon name="book" size={16}/></span><div><b>{detail.bookTitle || `Sách #${detail.bookId}`}</b><small>{detail.author || '—'} · BK-{String(detail.bookId).padStart(4, '0')}</small></div></div></td>
      <td><span className="detail-quantity">{detail.quantity}<small> cuốn</small></span></td>
      <td><span className="detail-money">{formatCurrency(detail.unitPrice)}</span></td>
      <td><b className="detail-subtotal">{formatCurrency(subTotal)}</b></td>
      <td><span className="detail-customer">{detail.receiverName || '—'}</span></td>
      <td><OrderStatusBadge status={detail.orderStatus}/></td>
      <td><button className="detail-view-button" onClick={() => onOpen(detail)}>Xem</button></td>
    </tr>
  )
}

function EmptyState({ hasFilters }) {
  return <div className="empty-state"><span><Icon name="layers" size={25}/></span><h3>{hasFilters ? 'Không tìm thấy chi tiết đơn hàng' : 'Chưa có chi tiết đơn hàng'}</h3><p>{hasFilters ? 'Thử thay từ khóa hoặc trạng thái lọc.' : 'Các dòng sản phẩm sẽ xuất hiện khi có đơn hàng.'}</p></div>
}

function exportDetails(details) {
  const rows = [
    ['Mã chi tiết', 'Mã đơn hàng', 'Mã sách', 'Tên sách', 'Tác giả', 'Số lượng', 'Đơn giá', 'Thành tiền', 'Người nhận', 'Ngày đặt', 'Trạng thái đơn'],
    ...details.map((detail) => [detail.orderDetailId, detail.orderId, detail.bookId, detail.bookTitle, detail.author, detail.quantity, detail.unitPrice, detail.subTotal ?? Number(detail.quantity || 0) * Number(detail.unitPrice || 0), detail.receiverName, detail.orderDate, getOrderStatus(detail.orderStatus).label]),
  ]
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'chi-tiet-don-hang-bookstore.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export default function OrderDetailsTable({
  details, allDetails, loading, error, query, status, page, pageCount, total,
  onQueryChange, onStatusChange, onPageChange, onRetry, onOpen,
}) {
  const firstItem = total ? (page - 1) * 7 + 1 : 0
  const lastItem = Math.min(page * 7, total)
  const hasFilters = Boolean(query) || status !== 'all'

  return (
    <section className="table-panel">
      <div className="table-heading"><div><h2>Tất cả dòng chi tiết <span className="heading-count">{loading ? '…' : total}</span></h2><p>Mỗi dòng là một sách trong đơn, với Quantity và UnitPrice tại thời điểm đặt.</p></div><button className="export-button" onClick={() => exportDetails(allDetails)}><span>↓</span> Xuất dữ liệu</button></div>
      <div className="table-toolbar"><label className="search-box"><Icon name="search"/><input aria-label="Tìm chi tiết đơn hàng" placeholder="Tìm mã đơn, sách, tác giả, người nhận..." value={query} onChange={(event) => onQueryChange(event.target.value)}/></label><label className="filter-select"><Icon name="filter"/><select aria-label="Lọc trạng thái đơn" value={status} onChange={(event) => onStatusChange(event.target.value)}><option value="all">Tất cả trạng thái</option>{[0, 1, 2, 3, 4].map((value) => <option key={value} value={value}>{getOrderStatus(value).label}</option>)}</select><Icon name="down" size={15}/></label></div>
      {error ? <div className="error-state"><div className="error-symbol">!</div><h3>Chưa thể tải chi tiết đơn hàng</h3><p>{error}</p><button className="secondary-button" onClick={onRetry}>Thử tải lại</button></div> : <>
        <div className="table-scroll"><table className="category-table order-details-table"><thead><tr><th>MÃ CHI TIẾT</th><th>ĐƠN HÀNG</th><th>SÁCH</th><th>SỐ LƯỢNG</th><th>ĐƠN GIÁ</th><th>THÀNH TIỀN</th><th>NGƯỜI NHẬN</th><th>TRẠNG THÁI ĐƠN</th><th/></tr></thead><tbody>
          {loading ? <LoadingRows/> : details.map((detail, index) => <DetailRow key={detail.orderDetailId} detail={detail} index={index} onOpen={onOpen}/>)}
          {!loading && details.length === 0 && <tr><td colSpan="9"><EmptyState hasFilters={hasFilters}/></td></tr>}
        </tbody></table></div>
        <div className="table-footer"><span>Hiển thị <b>{firstItem}–{lastItem}</b> trong <b>{total}</b> dòng chi tiết</span><div className="pagination"><button aria-label="Trang trước" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button key={index} className={page === index + 1 ? 'page-current' : ''} onClick={() => onPageChange(index + 1)}>{index + 1}</button>)}<button aria-label="Trang sau" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>›</button></div></div>
      </>}
    </section>
  )
}
