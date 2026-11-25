import { formatCurrency } from '../../../shared/utils/formatters.js'

export default function RevenueChart({ series, loading }) {
  const maxValue = Math.max(...series.items.map((item) => item.amount), 0)
  const noRevenue = maxValue === 0

  return (
    <section className="report-panel revenue-panel">
      <div className="report-panel-heading"><div><h2>Doanh thu đơn hoàn tất</h2><p>{series.unit === 'day' ? 'Diễn biến theo ngày' : 'Diễn biến theo tháng'} · chỉ gồm đơn đã hoàn tất</p></div><span className="chart-legend"><i/> Doanh thu</span></div>
      {loading ? <div className="report-empty">Đang tải dữ liệu biểu đồ…</div> : !series.items.length ? <div className="report-empty">Không có dữ liệu trong khoảng ngày này.</div> : <div className={`revenue-chart ${noRevenue ? 'revenue-chart-empty' : ''}`} role="img" aria-label="Biểu đồ doanh thu theo thời gian"><div className="chart-y-labels"><span>{formatCurrency(maxValue)}</span><span>{formatCurrency(maxValue / 2)}</span><span>0 ₫</span></div><div className="chart-plot"><div className="chart-gridline grid-top"/><div className="chart-gridline grid-middle"/><div className="chart-gridline grid-bottom"/><div className="chart-bars">{series.items.map((item, index) => { const height = maxValue ? Math.max((item.amount / maxValue) * 100, item.amount > 0 ? 3 : 0) : 0; const showLabel = series.unit === 'month' || index % 5 === 0 || index === series.items.length - 1; return <div className="chart-bar-column" key={item.key} title={`${item.label}: ${formatCurrency(item.amount)} · ${item.orderCount} đơn`}><div className="chart-bar-track"><i className="chart-bar" style={{ height: `${height}%` }}/></div><span>{showLabel ? item.label : ''}</span></div> })}</div></div></div>}
    </section>
  )
}
