import { Link } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency } from '../../../shared/utils/formatters.js'
import { useCart } from '../../cart/context/useCart.js'
import StoreBookCover from './StoreBookCover.jsx'

export default function BookCard({ book }) {
  const { addItem } = useCart()
  const outOfStock = Number(book.stock) <= 0

  return (
    <article className="store-book-card">
      <Link className="store-book-image-link" to={`/books/${book.bookId}`}><StoreBookCover src={book.imageUrl} title={book.title}/>{outOfStock && <span className="store-out-of-stock">Tạm hết hàng</span>}</Link>
      <div className="store-book-card-content"><Link to={`/books/${book.bookId}`} className="store-book-title">{book.title}</Link><span className="store-book-author">{book.author}</span><div className="store-book-card-bottom"><b>{formatCurrency(book.price)}</b><button aria-label={`Thêm ${book.title} vào giỏ`} title="Thêm vào giỏ" disabled={outOfStock} onClick={() => addItem(book.bookId)}><Icon name="plus" size={17}/></button></div></div>
    </article>
  )
}
