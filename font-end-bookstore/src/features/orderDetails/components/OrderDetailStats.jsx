import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency } from '../../../shared/utils/formatters.js'

export default function OrderDetailStats({ details, loading }) {
  const orderCount = new Set(details.map((detail) => detail.orderId)).size
  const quantity = details.reduce((total, detail) => total + Number(detail.quantity || 0), 0)
  const totalAmount = details.reduce((total, detail) => total + Number(detail.subTotal ?? (Number(detail.quantity || 0) * Number(detail.unitPrice || 0))), 0)

  return (
    <section className="stats-grid order-detail-stats" aria-label="Thống kê chi tiết đơn hàng">
      <article className="stat-card"><div className="stat-top"><span className="stat-icon lavender"><Icon name="layers" size={19}/></span><span className="stat-note">Bảng OrderDetails</span></div><div className="stat-value">{loading ? '—' : details.length}</div><div className="stat-caption">Dòng chi tiết đơn hàng</div><div className="stat-decoration decor-purple"/></article>
      <article className="stat-card"><div className="stat-top"><span className="stat-icon mint"><Icon name="shopping" size={19}/></span><span className="stat-trend">Có phát sinh sản phẩm</span></div><div className="stat-value">{loading ? '—' : orderCount}</div><div className="stat-caption">Đơn hàng có chi tiết</div><div className="stat-decoration decor-green"/></article>
      <article className="stat-card"><div className="stat-top"><span className="stat-icon amber"><Icon name="book" size={19}/></span><span className="stat-note">Tổng Quantity</span></div><div className="stat-value">{loading ? '—' : quantity}</div><div className="stat-caption">Số cuốn được đặt</div><div className="stat-decoration decor-orange"/></article>
      <article className="stat-card order-total-stat"><div className="stat-top"><span className="stat-icon lavender"><Icon name="chart" size={19}/></span><span className="stat-note">Tổng SubTotal</span></div><div className="stat-total-value">{loading ? '—' : formatCurrency(totalAmount)}</div><div className="stat-caption">Tổng các dòng, mọi trạng thái</div><div className="stat-decoration decor-purple"/></article>
    </section>
  )
}
