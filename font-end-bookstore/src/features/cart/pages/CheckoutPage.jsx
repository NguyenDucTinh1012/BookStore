import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { useAuth } from '../../auth/context/useAuth.js'
import { useCart } from '../context/useCart.js'
import useStoreCatalog from '../../storefront/hooks/useStoreCatalog.js'
import StoreBookCover from '../../storefront/components/StoreBookCover.jsx'
import { EmptyState, ErrorState, LoadingState } from '../../storefront/components/PageState.jsx'
import { createOrder } from '../../orders/api/ordersApi.js'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { formatCurrency } from '../../../shared/utils/formatters.js'

export default function CheckoutPage() {
  const cart = useCart()
  const { user } = useAuth()
  const { books, loading, error, reload } = useStoreCatalog()
  const navigate = useNavigate()
  const [form, setForm] = useState({ receiverName: user?.name || '', phone: '', address: '' })
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const rows = cart.items.map((item) => ({ item, book: books.find((book) => Number(book.bookId) === Number(item.bookId)) })).filter((row) => row.book)
  const total = rows.reduce((sum, row) => sum + Number(row.book.price) * row.item.quantity, 0)
  const stockIssue = rows.some(({ item, book }) => !book.isActive || Number(book.stock) < item.quantity)
  async function submit(event) {
    event.preventDefault(); setSubmitError('')
    if (stockIssue) { setSubmitError('Một số sách không đủ tồn kho. Hãy cập nhật số lượng trong giỏ.'); return }
    setSubmitting(true)
    try {
      const result = await createOrder({ ReceiverName: form.receiverName.trim(), Phone: form.phone.trim(), Address: form.address.trim(), Items: rows.map(({ item }) => ({ BookId: item.bookId, Quantity: item.quantity })) })
      cart.clearCart()
      navigate(`/orders/${result.orderId ?? result.OrderId}`, { state: { justCreated: true } })
    } catch (requestError) { setSubmitError(getApiErrorMessage(requestError)) }
    finally { setSubmitting(false) }
  }
  return <section className="store-catalog-page"><div className="store-page-intro"><span className="store-eyebrow">SECURE CHECKOUT</span><h1>Thông tin đặt mua</h1><p>Nhập thông tin nhận sách. Giá bán cuối cùng được backend xác nhận khi tạo đơn.</p></div>{loading ? <LoadingState label="Đang kiểm tra tồn kho..."/> : error ? <ErrorState message={error} onRetry={reload}/> : !rows.length ? <EmptyState title="Chưa có sản phẩm để đặt mua" description="Hãy thêm sách vào giỏ hàng trước."><Link className="store-button store-button-dark" to="/categories">Tìm sách</Link></EmptyState> : <form className="store-checkout-layout" onSubmit={submit}><div className="store-checkout-form"><h2>Thông tin người nhận</h2><label>Họ và tên<input required maxLength="100" autoComplete="name" value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })}/></label><label>Số điện thoại<input required maxLength="20" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/></label><label>Địa chỉ nhận hàng<textarea required maxLength="500" rows="3" autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}/></label><div className="store-payment-note"><Icon name="info" size={17}/> Thanh toán và giao hàng được cửa hàng xác nhận sau khi tiếp nhận đơn.</div>{stockIssue && <div className="auth-error">Tồn kho hiện tại không đủ cho một hoặc nhiều sản phẩm.</div>}{submitError && <div className="auth-error" role="alert">{submitError}</div>}<button className="store-button store-button-dark" disabled={submitting || stockIssue}>{submitting ? 'Đang gửi đơn...' : <>Xác nhận đặt mua <Icon name="chevron" size={16}/></>}</button></div><aside className="store-checkout-summary"><h2>Đơn hàng của bạn</h2>{rows.map(({ item, book }) => <div className="store-checkout-item" key={item.bookId}><StoreBookCover src={book.imageUrl} title={book.title}/><div><b>{book.title}</b><span>{item.quantity} × {formatCurrency(book.price)}</span></div><strong>{formatCurrency(Number(book.price) * item.quantity)}</strong></div>)}<div className="store-checkout-total"><span>Tổng tạm tính</span><b>{formatCurrency(total)}</b></div></aside></form>}</section>
}
