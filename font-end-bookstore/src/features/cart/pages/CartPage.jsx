import { Link } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency } from '../../../shared/utils/formatters.js'
import { useCart } from '../context/useCart.js'
import StoreBookCover from '../../storefront/components/StoreBookCover.jsx'
import useStoreCatalog from '../../storefront/hooks/useStoreCatalog.js'
import { EmptyState, ErrorState, LoadingState } from '../../storefront/components/PageState.jsx'

export default function CartPage() {
  const cart = useCart()
  const { books, loading, error, reload } = useStoreCatalog()
  const rows = cart.items.map((item) => ({ item, book: books.find((book) => Number(book.bookId) === Number(item.bookId)) })).filter((row) => row.book)
  const total = rows.reduce((sum, row) => sum + Number(row.book.price) * row.item.quantity, 0)
  return <section className="store-catalog-page"><div className="store-page-intro"><span className="store-eyebrow">YOUR READING LIST</span><h1>Giỏ hàng</h1><p>Kiểm tra sách và số lượng trước khi chuyển sang đặt mua.</p></div>{loading ? <LoadingState label="Đang tải giỏ hàng..."/> : error ? <ErrorState message={error} onRetry={reload}/> : !rows.length ? <EmptyState title="Giỏ hàng đang trống" description="Khám phá cửa hàng và chọn một cuốn sách bạn yêu thích."><Link className="store-button store-button-dark" to="/categories">Khám phá sách <Icon name="chevron" size={16}/></Link></EmptyState> : <div className="store-cart-layout"><div className="store-cart-list">{rows.map(({ item, book }) => <article className="store-cart-row" key={item.bookId}><Link to={`/books/${book.bookId}`} className="store-cart-cover"><StoreBookCover src={book.imageUrl} title={book.title}/></Link><div className="store-cart-book"><Link to={`/books/${book.bookId}`}><b>{book.title}</b></Link><span>{book.author}</span><small>{Number(book.stock) > 0 ? `Còn ${book.stock} cuốn` : 'Tạm hết hàng'}</small><button className="store-remove-button" onClick={() => cart.removeItem(item.bookId)}>Xóa khỏi giỏ</button></div><div className="store-cart-controls"><label>Số lượng<input type="number" min="1" max={Math.max(Number(book.stock), 1)} value={item.quantity} onChange={(event) => cart.updateQuantity(item.bookId, Math.min(Math.max(Number(event.target.value) || 1, 1), Math.max(Number(book.stock), 1)))}/></label><b>{formatCurrency(Number(book.price) * item.quantity)}</b></div></article>)}</div><aside className="store-cart-summary"><span className="store-eyebrow">TÓM TẮT ĐƠN</span><h2>{cart.itemCount} cuốn sách</h2><div><span>Tạm tính</span><b>{formatCurrency(total)}</b></div><p>Phí giao hàng sẽ được trao đổi khi xác nhận đơn.</p><Link className="store-button store-button-dark" to="/checkout">Tiến hành đặt mua <Icon name="chevron" size={16}/></Link><Link className="store-inline-link" to="/categories">Tiếp tục mua sách</Link></aside></div>}</section>
}
