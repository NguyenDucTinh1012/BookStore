import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency } from '../../../shared/utils/formatters.js'

export default function OrderStats({ orders, loading }) {
  const pending = orders.filter((order) => order.status === 0).length
  const shipping = orders.filter((order) => order.status === 2).length
  const total = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)

  return (
    <section className="stats-grid order-stats" aria-label="Thống kê đơn hàng">
      <article className="stat-card"><div className="stat-top"><span className="stat-icon lavender"><Icon name="shopping" size={19}/></span><span className="stat-note">Tất cả trạng thái</span></div><div className="stat-value">{loading ? '—' : orders.length}</div><div className="stat-caption">Tổng đơn hàng</div><div className="stat-decoration decor-purple"/></article>
      <article className="stat-card"><div className="stat-top"><span className="stat-icon amber"><Icon name="clock" size={19}/></span><span className="stat-note">Cần xử lý</span></div><div className="stat-value">{loading ? '—' : pending}</div><div className="stat-caption">Đơn chờ xử lý</div><div className="stat-decoration decor-orange"/></article>
      <article className="stat-card"><div className="stat-top"><span className="stat-icon mint"><Icon name="check" size={19}/></span><span className="stat-trend">Đang vận chuyển</span></div><div className="stat-value">{loading ? '—' : shipping}</div><div className="stat-caption">Đơn đang giao</div><div className="stat-decoration decor-green"/></article>
      <article className="stat-card order-total-stat"><div className="stat-top"><span className="stat-icon lavender"><Icon name="chart" size={19}/></span><span className="stat-note">Tổng giá trị đơn</span></div><div className="stat-total-value">{loading ? '—' : formatCurrency(total)}</div><div className="stat-caption">Tính trên danh sách hiện tại</div><div className="stat-decoration decor-purple"/></article>
    </section>
  )
}
