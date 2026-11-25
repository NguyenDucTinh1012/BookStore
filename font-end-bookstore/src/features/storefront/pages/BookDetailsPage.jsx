import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { getBookById } from '../../books/api/booksApi.js'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import { formatCurrency } from '../../../shared/utils/formatters.js'
import { useCart } from '../../cart/context/useCart.js'
import StoreBookCover from '../components/StoreBookCover.jsx'
import { ErrorState, LoadingState } from '../components/PageState.jsx'

export default function BookDetailsPage() {
  const { bookId } = useParams()
  const { addItem } = useCart()
  const [result, setResult] = useState({ bookId: null, book: null, error: '' })
  const [quantity, setQuantity] = useState(1)
  const loading = result.bookId !== Number(bookId)
  const book = loading ? null : result.book
  const error = loading ? '' : result.error
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let isCurrent = true
    getBookById(Number(bookId))
      .then((data) => { if (isCurrent) { setResult({ bookId: Number(bookId), book: data, error: '' }); setQuantity(1) } })
      .catch((requestError) => { if (isCurrent) setResult({ bookId: Number(bookId), book: null, error: getApiErrorMessage(requestError) }) })
    return () => { isCurrent = false }
  }, [bookId])

  if (loading) return <LoadingState label="Đang mở trang sách..."/>
  if (error || !book) return <section className="store-catalog-page"><ErrorState message={error || 'Không tìm thấy sách.'}/></section>
  if (!book.isActive) return <section className="store-catalog-page"><ErrorState message="Sách này hiện chưa được mở bán."/></section>

  const outOfStock = Number(book.stock) <= 0

  function addToCart() {
    addItem(book.bookId, quantity)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2600)
  }

  return (
    <section className="store-book-details-page"><div className="store-breadcrumb"><Link to="/">Trang chủ</Link><Icon name="chevron" size={14}/><Link to="/categories">Danh mục sách</Link><Icon name="chevron" size={14}/><span>{book.title}</span></div><div className="store-book-detail-layout"><div className="store-book-detail-cover"><StoreBookCover src={book.imageUrl} title={book.title}/><span className="store-cover-caption">BOOKSTORE · TUYỂN CHỌN</span></div><div className="store-book-detail-info"><span className="store-eyebrow">{book.categoryName || 'SÁCH ĐƯỢC TUYỂN CHỌN'}</span><h1>{book.title}</h1><p className="store-detail-author">Tác giả <b>{book.author}</b></p><div className="store-detail-price">{formatCurrency(book.price)}</div><div className={`store-stock-state ${outOfStock ? 'is-out' : ''}`}><i/>{outOfStock ? 'Hiện đã hết hàng' : `Còn ${book.stock} cuốn trong kho`}</div><div className="store-detail-divider"/><p className="store-detail-description">{book.description || 'Nhà sách chưa cập nhật phần giới thiệu cho cuốn sách này.'}</p><div className="store-purchase-row"><label className="store-quantity-control"><span>Số lượng</span><input type="number" min="1" max={Math.max(Number(book.stock), 1)} value={quantity} disabled={outOfStock} onChange={(event) => setQuantity(Math.min(Math.max(Number(event.target.value) || 1, 1), Math.max(Number(book.stock), 1)))}/></label><button className="store-button store-button-dark store-add-cart" disabled={outOfStock} onClick={addToCart}><Icon name="shopping" size={18}/>{outOfStock ? 'Tạm hết hàng' : added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}</button></div>{added && <Link to="/cart" className="store-added-note">Đã thêm {quantity} cuốn vào giỏ. Xem giỏ hàng <Icon name="chevron" size={15}/></Link>}<div className="store-detail-meta"><span><Icon name="check" size={16}/> Giá sách được xác nhận khi đặt mua</span><span><Icon name="book" size={16}/> Mã sách BK-{String(book.bookId).padStart(4, '0')}</span></div></div></div></section>
  )
}
