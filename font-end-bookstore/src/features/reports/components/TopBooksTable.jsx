import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency } from '../../../shared/utils/formatters.js'

export default function TopBooksTable({ books, loading }) {
  const maxQuantity = Math.max(...books.map((book) => book.quantity), 1)

  return (
    <section className="report-panel top-books-panel"><div className="report-panel-heading"><div><h2>Sách được đặt nhiều</h2><p>Xếp theo số lượng · loại các dòng thuộc đơn đã hủy</p></div></div>{loading ? <div className="report-empty compact">Đang tổng hợp sách…</div> : books.length ? <div className="top-books-list">{books.map((book, index) => <article className="top-book-row" key={book.bookId}><span className={`top-book-rank ${index === 0 ? 'rank-first' : ''}`}>{String(index + 1).padStart(2, '0')}</span><span className="top-book-icon"><Icon name="book" size={16}/></span><div className="top-book-information"><b>{book.title}</b><small>{book.author || `Mã sách BK-${String(book.bookId).padStart(4, '0')}`}</small><div className="top-book-progress"><i style={{ width: `${(book.quantity / maxQuantity) * 100}%` }}/></div></div><div className="top-book-values"><b>{book.quantity} cuốn</b><small>{formatCurrency(book.amount)}</small></div></article>)}</div> : <div className="report-empty compact">Chưa có dòng sản phẩm trong kỳ.</div>}</section>
  )
}
