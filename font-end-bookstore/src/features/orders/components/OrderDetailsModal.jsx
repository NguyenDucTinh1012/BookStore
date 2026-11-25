import { useState } from 'react'
import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js'
import OrderStatusBadge from './OrderStatusBadge.jsx'

const statusOptions = [0, 1, 2, 3, 4]

export default function OrderDetailsModal({ order, saving, error, onClose, onUpdateStatus }) {
  const [nextStatus, setNextStatus] = useState(String(order.status))
  const isTerminal = order.status === 3 || order.status === 4
  const items = order.items || []
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)

  async function submitStatus(event) {
    event.preventDefault()
    await onUpdateStatus(order, Number(nextStatus))
  }

  return (
    <div className="modal-backdrop order-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog order-dialog" role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
        <div className="order-dialog-header"><div><div className="eyebrow"><span className="eyebrow-dot"/> CHI TIẾT ĐƠN HÀNG</div><h2 id="order-dialog-title">Đơn hàng #{String(order.orderId).padStart(6, '0')}</h2><p>Đặt lúc {formatDate(order.orderDate)}</p></div><button className="dialog-close" aria-label="Đóng" onClick={onClose}><Icon name="close" size={19}/></button></div>
        <div className="order-detail-content">
          <div className="order-detail-summary"><div><small>TRẠNG THÁI</small><OrderStatusBadge status={order.status}/></div><div><small>TỔNG TIỀN</small><b className="order-detail-total">{formatCurrency(order.totalAmount)}</b></div></div>
          <section className="order-info-section"><h3>Thông tin nhận hàng</h3><div className="receiver-grid"><div><small>Người nhận</small><b>{order.receiverName || '—'}</b></div><div><small>Số điện thoại</small><b>{order.phone || '—'}</b></div><div className="receiver-address"><small>Địa chỉ giao hàng</small><b>{order.address || '—'}</b></div><div className="receiver-user"><small>User ID</small><b title={order.userId}>{order.userId || '—'}</b></div></div></section>
          <section className="order-info-section order-products-section"><div className="order-section-title"><h3>Sản phẩm trong đơn</h3><span>{totalQuantity} cuốn · {items.length} dòng</span></div>{items.length ? <div className="order-products-list">{items.map((item) => { const subTotal = item.subTotal ?? Number(item.quantity || 0) * Number(item.unitPrice || 0); return <article className="order-product-row" key={item.orderDetailId || `${item.bookId}-${item.quantity}`}><div className="order-product-icon"><Icon name="book" size={17}/></div><div className="order-product-info"><b>{item.bookTitle || `Sách #${item.bookId}`}</b><small>Mã sách BK-{String(item.bookId).padStart(4, '0')}</small></div><div className="order-product-quantity">× {item.quantity}</div><div className="order-product-price"><b>{formatCurrency(subTotal)}</b><small>{formatCurrency(item.unitPrice)} / cuốn</small></div></article> })}</div> : <div className="order-no-items">API chưa trả về sản phẩm trong đơn hàng này.</div>}</section>
          {!isTerminal && <form className="order-status-form" onSubmit={submitStatus}><label><span><b>Cập nhật trạng thái</b><small>Đơn hoàn tất hoặc đã hủy không thể cập nhật.</small></span><select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>{statusOptions.map((value) => <option value={value} key={value}>{['Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Hoàn tất', 'Đã hủy'][value]}</option>)}</select></label>{error && <div className="form-error">{error}</div>}<div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose} disabled={saving}>Đóng</button><button className="primary-button" disabled={saving || Number(nextStatus) === order.status}>{saving ? 'Đang cập nhật…' : <><Icon name="check" size={17}/> Lưu trạng thái</>}</button></div></form>}
          {isTerminal && <div className="terminal-order-note"><Icon name="check" size={16}/> Đơn hàng đã kết thúc nên không thể cập nhật trạng thái.</div>}
        </div>
      </section>
    </div>
  )
}
