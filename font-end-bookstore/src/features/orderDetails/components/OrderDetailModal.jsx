import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency, formatDate } from '../../../shared/utils/formatters.js'
import OrderStatusBadge from '../../orders/components/OrderStatusBadge.jsx'

function InfoField({ label, children }) {
  return <div className="order-detail-info-field"><small>{label}</small><b>{children || '—'}</b></div>
}

export default function OrderDetailModal({ detail, onClose }) {
  const subTotal = detail.subTotal ?? Number(detail.quantity || 0) * Number(detail.unitPrice || 0)

  return (
    <div className="modal-backdrop order-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="dialog order-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="order-detail-dialog-title">
        <div className="order-dialog-header"><div><div className="eyebrow"><span className="eyebrow-dot"/> CHI TIẾT SẢN PHẨM ĐẶT MUA</div><h2 id="order-detail-dialog-title">Dòng #{String(detail.orderDetailId).padStart(6, '0')}</h2><p>Thông tin chỉ đọc từ API OrderDetails.</p></div><button className="dialog-close" aria-label="Đóng" onClick={onClose}><Icon name="close" size={19}/></button></div>
        <div className="order-detail-readonly">
          <div className="order-detail-readonly-book"><span><Icon name="book" size={22}/></span><div><b>{detail.bookTitle || `Sách #${detail.bookId}`}</b><small>{detail.author || 'Chưa có thông tin tác giả'}</small></div></div>
          <div className="order-detail-readonly-grid">
            <InfoField label="Mã chi tiết">{detail.orderDetailId}</InfoField>
            <InfoField label="Mã đơn hàng">#{String(detail.orderId).padStart(6, '0')}</InfoField>
            <InfoField label="Mã sách">BK-{String(detail.bookId).padStart(4, '0')}</InfoField>
            <InfoField label="Người nhận">{detail.receiverName}</InfoField>
            <InfoField label="Ngày đặt">{formatDate(detail.orderDate)}</InfoField>
            <InfoField label="Trạng thái đơn"><OrderStatusBadge status={detail.orderStatus}/></InfoField>
            <InfoField label="Số lượng">{detail.quantity} cuốn</InfoField>
            <InfoField label="Đơn giá tại thời điểm đặt">{formatCurrency(detail.unitPrice)}</InfoField>
          </div>
          <div className="order-detail-total-row"><span>Thành tiền dòng hàng</span><b>{formatCurrency(subTotal)}</b></div>
          <div className="order-detail-readonly-note"><Icon name="clock" size={16}/> Đơn giá là giá được lưu tại thời điểm đặt hàng trong OrderDetails.</div>
        </div>
        <div className="dialog-actions"><button className="secondary-button" onClick={onClose}>Đóng</button></div>
      </section>
    </div>
  )
}
