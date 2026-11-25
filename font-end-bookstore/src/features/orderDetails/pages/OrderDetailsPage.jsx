import { useEffect, useMemo, useState } from 'react'
import Icon from '../../../components/ui/Icon.jsx'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { getOrderDetails } from '../api/orderDetailsApi.js'
import OrderDetailModal from '../components/OrderDetailModal.jsx'
import OrderDetailStats from '../components/OrderDetailStats.jsx'
import OrderDetailsTable from '../components/OrderDetailsTable.jsx'
import '../order-details.css'

const PAGE_SIZE = 7

export default function OrderDetailsPage() {
  const [details, setDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedDetail, setSelectedDetail] = useState(null)

  async function reloadDetails() {
    setLoading(true)
    setLoadError('')
    try {
      setDetails(await getOrderDetails())
    } catch (error) {
      setLoadError(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isCurrent = true
    getOrderDetails()
      .then((items) => { if (isCurrent) setDetails(items) })
      .catch((error) => { if (isCurrent) setLoadError(getApiErrorMessage(error)) })
      .finally(() => { if (isCurrent) setLoading(false) })
    return () => { isCurrent = false }
  }, [])

  const filteredDetails = useMemo(() => details
    .filter((detail) => {
      const searchable = `${detail.orderDetailId || ''} ${detail.orderId || ''} ${detail.bookId || ''} ${detail.bookTitle || ''} ${detail.author || ''} ${detail.receiverName || ''}`.toLocaleLowerCase('vi')
      const matchesQuery = searchable.includes(query.toLocaleLowerCase('vi'))
      const matchesStatus = status === 'all' || String(detail.orderStatus) === status
      return matchesQuery && matchesStatus
    })
    .sort((first, second) => new Date(second.orderDate || 0) - new Date(first.orderDate || 0)), [details, query, status])

  const pageCount = Math.max(1, Math.ceil(filteredDetails.length / PAGE_SIZE))
  const visibleDetails = filteredDetails.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <main className="page-content" id="order-details">
      <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> QUẢN LÝ BÁN HÀNG</div><h1>Chi tiết đơn hàng</h1><p className="page-subtitle">Tra cứu từng đầu sách, số lượng và đơn giá được ghi nhận khi khách đặt.</p></div><button className="secondary-button order-refresh-button" onClick={reloadDetails} disabled={loading}><Icon name="clock" size={16}/> {loading ? 'Đang tải…' : 'Làm mới'}</button></section>
      <OrderDetailStats details={details} loading={loading}/>
      <OrderDetailsTable
        details={visibleDetails}
        allDetails={filteredDetails}
        loading={loading}
        error={loadError}
        query={query}
        status={status}
        page={page}
        pageCount={pageCount}
        total={filteredDetails.length}
        onQueryChange={(value) => { setQuery(value); setPage(1) }}
        onStatusChange={(value) => { setStatus(value); setPage(1) }}
        onPageChange={setPage}
        onRetry={reloadDetails}
        onOpen={setSelectedDetail}
      />
      <footer className="page-footer"><span>© {new Date().getFullYear()} BookStore · Quản trị</span><span>Chỉ đọc dữ liệu chi tiết đơn hàng <b>♥</b></span></footer>
      {selectedDetail && <OrderDetailModal detail={selectedDetail} onClose={() => setSelectedDetail(null)}/>}
    </main>
  )
}
