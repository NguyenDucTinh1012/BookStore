import Icon from '../../../components/ui/Icon.jsx'
import { formatDate } from '../../../shared/utils/formatters.js'

function LoadingRows() {
  return Array.from({ length: 5 }, (_, index) => (
    <tr className="skeleton-row" key={index}>
      <td><i/></td><td><i className="skeleton-long"/></td><td><i className="skeleton-medium"/></td>
      <td><i className="skeleton-short"/></td><td><i className="skeleton-medium"/></td><td><i className="skeleton-short"/></td>
    </tr>
  ))
}

function CategoryRow({ category, index, onEdit, onDelete }) {
  const categoryIcons = ['book', 'layers', 'bookOpen', 'grid', 'chart']
  return (
    <tr className="category-row" style={{ '--row-index': index }}>
      <td className="check-column"><input type="checkbox" aria-label={`Chọn ${category.categoryName}`}/></td>
      <td><div className="category-name-cell"><span className={`category-mark mark-${index % 5}`}><Icon name={categoryIcons[index % 5]} size={18}/></span><div><b>{category.categoryName}</b><small>CAT-{String(category.categoryId).padStart(4, '0')}</small></div></div></td>
      <td><span className="description-cell" title={category.description || ''}>{category.description || <i className="muted-dash">Chưa có mô tả</i>}</span></td>
      <td><span className={`status-pill ${category.isActive ? 'status-active' : 'status-inactive'}`}><i/>{category.isActive ? 'Hoạt động' : 'Đang ẩn'}</span></td>
      <td><span className="date-cell">{formatDate(category.createdAt)}</span></td>
      <td><div className="row-actions"><button aria-label={`Sửa ${category.categoryName}`} title="Chỉnh sửa" onClick={() => onEdit(category)}><Icon name="edit" size={17}/></button><button className="delete-action" aria-label={`Xóa ${category.categoryName}`} title="Xóa" onClick={() => onDelete(category)}><Icon name="trash" size={17}/></button></div></td>
    </tr>
  )
}

function EmptyState({ hasFilters, onCreate }) {
  return (
    <div className="empty-state">
      <span><Icon name="bookOpen" size={25}/></span>
      <h3>{hasFilters ? 'Không tìm thấy danh mục' : 'Kệ sách của bạn vẫn còn trống'}</h3>
      <p>{hasFilters ? 'Thử đổi từ khóa hoặc bộ lọc để xem kết quả khác.' : 'Tạo danh mục đầu tiên để bắt đầu sắp xếp kho sách.'}</p>
      {!hasFilters && <button className="primary-button" onClick={onCreate}><Icon name="plus" size={17}/> Thêm danh mục</button>}
    </div>
  )
}

export default function CategoryTable({
  categories, loading, loadError, query, status, page, pageCount, total,
  onQueryChange, onStatusChange, onPageChange, onRetry, onCreate, onEdit, onDelete,
}) {
  const firstItem = total ? (page - 1) * 7 + 1 : 0
  const lastItem = Math.min(page * 7, total)
  const hasFilters = Boolean(query) || status !== 'all'

  function exportCsv() {
    const rows = [
      ['Mã danh mục', 'Tên danh mục', 'Mô tả', 'Trạng thái', 'Ngày tạo'],
      ...categories.map((item) => [item.categoryId, item.categoryName, item.description || '', item.isActive ? 'Hoạt động' : 'Đang ẩn', item.createdAt || '']),
    ]
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'danh-muc-sach.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="table-panel">
      <div className="table-heading"><div><h2>Tất cả danh mục <span className="heading-count">{loading ? '…' : total}</span></h2><p>Theo dõi và cập nhật các danh mục sách của bạn.</p></div><button className="export-button" onClick={exportCsv}><span>↓</span> Xuất dữ liệu</button></div>
      <div className="table-toolbar"><label className="search-box"><Icon name="search" size={18}/><input aria-label="Tìm danh mục" placeholder="Tìm theo tên danh mục..." value={query} onChange={(event) => onQueryChange(event.target.value)}/><kbd>⌘ K</kbd></label><label className="filter-select"><Icon name="filter" size={17}/><select aria-label="Lọc trạng thái" value={status} onChange={(event) => onStatusChange(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="inactive">Đang ẩn</option></select><Icon name="down" size={15}/></label></div>
      {loadError ? <div className="error-state"><div className="error-symbol">!</div><h3>Chưa thể tải danh mục</h3><p>{loadError}</p><button className="secondary-button" onClick={onRetry}>Thử tải lại</button></div> : <>
        <div className="table-scroll"><table className="category-table"><thead><tr><th className="check-column"><input type="checkbox" aria-label="Chọn tất cả"/></th><th>TÊN DANH MỤC</th><th>MÔ TẢ</th><th>TRẠNG THÁI</th><th>NGÀY TẠO</th><th className="actions-heading">THAO TÁC</th></tr></thead><tbody>
          {loading ? <LoadingRows/> : categories.map((category, index) => <CategoryRow key={category.categoryId} category={category} index={index} onEdit={onEdit} onDelete={onDelete}/ >)}
          {!loading && categories.length === 0 && <tr><td colSpan="6"><EmptyState hasFilters={hasFilters} onCreate={onCreate}/></td></tr>}
        </tbody></table></div>
        <div className="table-footer"><span>Hiển thị <b>{firstItem}–{lastItem}</b> trong <b>{total}</b> danh mục</span><div className="pagination"><button aria-label="Trang trước" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button key={index} className={page === index + 1 ? 'page-current' : ''} onClick={() => onPageChange(index + 1)}>{index + 1}</button>)}<button aria-label="Trang sau" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>›</button></div></div>
      </>}
    </section>
  )
}
