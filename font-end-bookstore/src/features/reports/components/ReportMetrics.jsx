import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency } from '../../../shared/utils/formatters.js'

export default function ReportMetrics({ report, loading }) {
  const metrics = [
    { label: 'Doanh thu đơn hoàn tất', value: formatCurrency(report.completedRevenue), note: 'Chỉ cộng Order có Status = 3', icon: 'chart', iconClass: 'lavender' },
    { label: 'Đơn hoàn tất', value: report.completedOrders.length, note: `Trong ${report.ordersInRange.length} đơn của kỳ`, icon: 'check', iconClass: 'mint' },
    { label: 'Tổng đơn trong kỳ', value: report.ordersInRange.length, note: `${report.cancelledCount} đơn đã hủy`, icon: 'shopping', iconClass: 'amber' },
    { label: 'Giá trị trung bình', value: formatCurrency(report.averageCompletedOrder), note: 'Doanh thu hoàn tất / số đơn hoàn tất', icon: 'layers', iconClass: 'lavender' },
  ]

  return <section className="report-metrics-grid" aria-label="Chỉ số báo cáo">{metrics.map((metric) => <article className="report-metric-card" key={metric.label}><div className="report-metric-heading"><span className={`stat-icon ${metric.iconClass}`}><Icon name={metric.icon} size={18}/></span><span className="report-metric-note">{metric.note}</span></div><div className="report-metric-value">{loading ? '—' : metric.value}</div><div className="report-metric-label">{metric.label}</div></article>)}</section>
}
