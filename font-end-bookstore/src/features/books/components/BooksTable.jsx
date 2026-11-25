import Icon from '../../../components/ui/Icon.jsx'
import { formatCurrency } from '../../../shared/utils/formatters.js'
import BookCover from './BookCover.jsx'

function LoadingRows() {
  return Array.from({ length: 5 }, (_, index) => <tr className="skeleton-row" key={index}><td><i/></td><td><i className="skeleton-long"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-short"/></td><td><i className="skeleton-short"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-short"/></td></tr>)
}

function BookRow({ book, categoryName, index, onEdit, onDelete }) {
  return (
    <tr className="category-row" style={{ '--row-index': index }}>
      <td className="check-column"><input type="checkbox" aria-label={`Chọn ${book.title}`}/></td>
      <td><div className="book-name-cell"><BookCover src={book.imageUrl} title={book.title}/><div><b>{book.title}</b><small>{book.author} · BK-{String(book.bookId).padStart(4, '0')}</small></div></div></td>
      <td><span className="book-category">{categoryName || 'Chưa phân loại'}</span></td>
      <td><b className="book-price">{formatCurrency(book.price)}</b></td>
      <td><span className={`stock-value ${book.stock <= 5 ? 'stock-low' : ''}`}>{book.stock} <small>cuốn</small></span></td>
      <td><span className={`status-pill ${book.isActive ? 'status-active' : 'status-inactive'}`}><i/>{book.isActive ? 'Hoạt động' : 'Đang ẩn'}</span></td>
      <td><div className="row-actions"><button aria-label={`Sửa ${book.title}`} title="Chỉnh sửa sách, bao gồm ảnh bìa" onClick={() => onEdit(book)}><Icon name="edit" size={17}/></button><button className="delete-action" aria-label={`Xóa ${book.title}`} title="Xóa sách" onClick={() => onDelete(book)}><Icon name="trash" size={17}/></button></div></td>
    </tr>
  )
}

function EmptyState({ hasFilters, onCreate }) {
  return <div className="empty-state"><span><Icon name="book" size={25}/></span><h3>{hasFilters ? 'Không tìm thấy sách' : 'Chưa có sách trong kho'}</h3><p>{hasFilters ? 'Thử thay từ khóa hoặc bộ lọc.' : 'Thêm sách đầu tiên để bắt đầu quản lý kho.'}</p>{!hasFilters && <button className="primary-button" onClick={onCreate}><Icon name="plus"/> Thêm sách</button>}</div>
}

function exportBooks(books) {
  const rows = [
    ['Mã sách', 'Tên sách', 'Tác giả', 'Danh mục', 'Giá', 'Tồn kho', 'Trạng thái'],
    ...books.map((book) => [book.bookId, book.title, book.author, book.categoryName || '', book.price, book.stock, book.isActive ? 'Hoạt động' : 'Đang ẩn']),
  ]
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'sach-bookstore.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export default function BooksTable({
  books, categories, loading, loadError, categoryError, query, categoryFilter, statusFilter,
  page, pageCount, total, onQueryChange, onCategoryChange, onStatusChange, onPageChange,
  onRetry, onRetryCategories, onCreate, onEdit, onDelete,
}) {
  const firstItem = total ? (page - 1) * 7 + 1 : 0
  const lastItem = Math.min(page * 7, total)
  const hasFilters = Boolean(query) || categoryFilter !== 'all' || statusFilter !== 'all'
  const categoryNameById = new Map(categories.map((category) => [category.categoryId, category.categoryName]))

  return (
    <section className="table-panel">
      <div className="table-heading"><div><h2>Tất cả sách <span className="heading-count">{loading ? '…' : total}</span></h2><p>Danh sách lấy trực tiếp từ bảng Book trong cơ sở dữ liệu.</p></div><button className="export-button" onClick={() => exportBooks(books)}><span>↓</span> Xuất dữ liệu</button></div>
      <div className="table-toolbar"><label className="search-box"><Icon name="search"/><input aria-label="Tìm sách" placeholder="Tìm tên sách, tác giả..." value={query} onChange={(event) => onQueryChange(event.target.value)}/><kbd>⌘ K</kbd></label><label className="filter-select"><Icon name="filter"/><select aria-label="Lọc theo danh mục" value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)}><option value="all">Tất cả danh mục</option>{categories.map((category) => <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>)}</select><Icon name="down" size={15}/></label><label className="filter-select"><select aria-label="Lọc trạng thái sách" value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}><option value="all">Mọi trạng thái</option><option value="active">Đang hoạt động</option><option value="inactive">Đang ẩn</option></select><Icon name="down" size={15}/></label></div>
      {categoryError && <div className="books-inline-error">Không tải được danh mục để lọc/chọn: {categoryError} <button onClick={onRetryCategories}>Tải lại</button></div>}
      {!categoryError && categories.length === 0 && !loading && <div className="books-inline-error">Chưa có danh mục để gán cho sách. Hãy tạo danh mục trước khi thêm sách.</div>}
      {loadError ? <div className="error-state"><div className="error-symbol">!</div><h3>Chưa thể tải sách</h3><p>{loadError}</p><button className="secondary-button" onClick={onRetry}>Thử tải lại</button></div> : <>
        <div className="table-scroll"><table className="category-table books-table"><thead><tr><th className="check-column"><input type="checkbox" aria-label="Chọn tất cả sách"/></th><th>SÁCH</th><th>DANH MỤC</th><th>GIÁ BÁN</th><th>TỒN KHO</th><th>TRẠNG THÁI</th><th className="actions-heading">THAO TÁC</th></tr></thead><tbody>
          {loading ? <LoadingRows/> : books.map((book, index) => <BookRow key={book.bookId} book={book} categoryName={book.categoryName || categoryNameById.get(book.categoryId)} index={index} onEdit={onEdit} onDelete={onDelete}/>)}
          {!loading && books.length === 0 && <tr><td colSpan="7"><EmptyState hasFilters={hasFilters} onCreate={onCreate}/></td></tr>}
        </tbody></table></div>
        <div className="table-footer"><span>Hiển thị <b>{firstItem}–{lastItem}</b> trong <b>{total}</b> sách</span><div className="pagination"><button aria-label="Trang trước" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button key={index} className={page === index + 1 ? 'page-current' : ''} onClick={() => onPageChange(index + 1)}>{index + 1}</button>)}<button aria-label="Trang sau" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>›</button></div></div>
      </>}
    </section>
  )
}
