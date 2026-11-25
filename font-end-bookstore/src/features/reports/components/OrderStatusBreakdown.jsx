import OrderStatusBadge from '../../orders/components/OrderStatusBadge.jsx'
import { ORDER_STATUS_VALUES } from '../utils/reportCalculations.js'

export default function OrderStatusBreakdown({ report, loading }) {
  const maxCount = Math.max(...ORDER_STATUS_VALUES.map((status) => report.statusCounts.get(status)), 1)

  return (
    <section className="report-panel status-report-panel"><div className="report-panel-heading"><div><h2>Trạng thái đơn</h2><p>Phân bổ Orders trong khoảng ngày đã chọn.</p></div></div><div className="status-report-list">{ORDER_STATUS_VALUES.map((status) => { const count = report.statusCounts.get(status); return <div className="status-report-row" key={status}><OrderStatusBadge status={status}/><div className="status-report-track"><i style={{ width: `${loading ? 0 : (count / maxCount) * 100}%` }}/></div><b>{loading ? '—' : count}</b></div> })}</div></section>
  )
}
