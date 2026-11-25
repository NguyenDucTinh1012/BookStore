import { useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { formatCurrency } from '../../../shared/utils/formatters.js'
import { getReportData } from '../api/reportsApi.js'
import CategorySalesList from '../components/CategorySalesList.jsx'
import InventorySummary from '../components/InventorySummary.jsx'
import OrderStatusBreakdown from '../components/OrderStatusBreakdown.jsx'
import ReportFilters from '../components/ReportFilters.jsx'
import ReportMetrics from '../components/ReportMetrics.jsx'
import RevenueChart from '../components/RevenueChart.jsx'
import TopBooksTable from '../components/TopBooksTable.jsx'
import { calculateReport, getPresetRange } from '../utils/reportCalculations.js'
import '../reports.css'

const emptyData = { orders: [], orderDetails: [], books: [], categories: [] }

function downloadReport(report, startDate, endDate) {
  const rows = [
    ['Báo cáo BookStore', `${startDate} — ${endDate}`],
    [],
    ['Chỉ số', 'Giá trị'],
    ['Doanh thu đơn hoàn tất', report.completedRevenue],
    ['Đơn hoàn tất', report.completedOrders.length],
    ['Tổng đơn trong kỳ', report.ordersInRange.length],
    ['Giá trị trung bình đơn hoàn tất', report.averageCompletedOrder],
    [],
    ['Trạng thái đơn hàng', 'Số đơn'],
    ...[0, 1, 2, 3, 4].map((status) => [['Chờ xử lý', 'Đã xác nhận', 'Đang giao', 'Hoàn tất', 'Đã hủy'][status], report.statusCounts.get(status)]),
    [],
    ['Doanh thu theo thời gian', 'Doanh thu', 'Số đơn hoàn tất'],
    ...report.revenueSeries.items.map((item) => [item.label, item.amount, item.orderCount]),
    [],
    ['Sách được đặt nhiều', 'Mã sách', 'Số lượng', 'Thành tiền'],
    ...report.topBooks.map((book) => [book.title, book.bookId, book.quantity, book.amount]),
    [],
    ['Hiệu quả theo danh mục', 'Số lượng', 'Thành tiền'],
    ...report.categorySales.map((category) => [category.name, category.quantity, category.amount]),
  ]
  const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n')}`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `bao-cao-bookstore-${startDate}-${endDate}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const [data, setData] = useState(emptyData)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const initialRange = getPresetRange('30days')
  const [preset, setPreset] = useState('30days')
  const [startDate, setStartDate] = useState(initialRange.startDate)
  const [endDate, setEndDate] = useState(initialRange.endDate)

  async function reloadReport() {
    setLoading(true)
    setLoadError('')
    try {
      setData(await getReportData())
    } catch (error) {
      setLoadError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isCurrent = true
    getReportData()
      .then((reportData) => { if (isCurrent) setData(reportData) })
      .catch((error) => { if (isCurrent) setLoadError(getApiErrorMessage(error)) })
      .finally(() => { if (isCurrent) setLoading(false) })
    return () => { isCurrent = false }
  }, [])

  const report = useMemo(() => calculateReport(data, startDate, endDate), [data, startDate, endDate])
  const invalidRange = !startDate || !endDate || startDate > endDate

  function selectPreset(value) {
    const range = getPresetRange(value)
    setPreset(value)
    setStartDate(range.startDate)
    setEndDate(range.endDate)
  }

  function changeDate(field, value) {
    setPreset('custom')
    if (field === 'startDate') setStartDate(value)
    if (field === 'endDate') setEndDate(value)
  }

  return (
    <main className="page-content report-page">
      <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> PHÂN TÍCH CỬA HÀNG</div><h1>Báo cáo & thống kê</h1><p className="page-subtitle">Tổng hợp doanh thu, trạng thái đơn, mặt hàng bán chạy và tình trạng kho.</p></div><button className="secondary-button report-refresh" onClick={reloadReport} disabled={loading}>{loading ? 'Đang tải…' : 'Làm mới dữ liệu'}</button></section>

      <ReportFilters preset={preset} startDate={startDate} endDate={endDate} onPresetChange={selectPreset} onDateChange={changeDate} onExport={() => downloadReport(report, startDate, endDate)} disabled={loading || Boolean(loadError) || invalidRange}/>

      {invalidRange && <div className="report-range-error">Hãy chọn khoảng ngày hợp lệ; ngày bắt đầu phải trước hoặc bằng ngày kết thúc.</div>}
      {loadError ? <section className="table-panel report-load-error"><div className="error-state"><div className="error-symbol">!</div><h3>Chưa thể tổng hợp báo cáo</h3><p>{loadError}</p><p>Báo cáo cần dữ liệu từ Orders, OrderDetails, Books và Categories.</p><button className="secondary-button" onClick={reloadReport}>Thử tải lại</button></div></section> : <>
        <ReportMetrics report={report} loading={loading}/>

        <div className="report-main-grid"><RevenueChart series={report.revenueSeries} loading={loading}/><OrderStatusBreakdown report={report} loading={loading}/></div>

        <div className="report-lower-grid"><TopBooksTable books={report.topBooks} loading={loading}/><CategorySalesList categories={report.categorySales} loading={loading}/></div>

        <InventorySummary books={data.books} categories={data.categories} loading={loading}/>

        <div className="report-method-note"><span>ⓘ</span><p><b>Cách tính:</b> doanh thu chỉ cộng đơn có trạng thái Hoàn tất. Sách và danh mục bán chạy loại các dòng thuộc đơn Đã hủy. Tồn kho phản ánh dữ liệu Books hiện tại, không phải tồn kho lịch sử.</p><strong>{loading ? 'Đang tổng hợp…' : `${report.ordersInRange.length} đơn · ${formatCurrency(report.completedRevenue)} doanh thu hoàn tất`}</strong></div>
      </>}
      <footer className="page-footer"><span>© {new Date().getFullYear()} BookStore · Quản trị</span><span>Báo cáo tổng hợp từ dữ liệu cửa hàng <b>♥</b></span></footer>
    </main>
  )
}
