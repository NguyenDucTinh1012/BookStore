import Icon from '../../../components/ui/Icon.jsx'

export default function InventorySummary({ books, categories, loading }) {
  const stockCount = books.reduce((total, book) => total + Math.max(Number(book.stock || 0), 0), 0)
  const lowStock = books.filter((book) => Number(book.stock || 0) <= 5).length
  const noStock = books.filter((book) => Number(book.stock || 0) === 0).length
  const activeCategories = categories.filter((category) => category.isActive).length

  return <section className="report-panel inventory-report-panel"><div className="report-panel-heading"><div><h2>Tình trạng kho hiện tại</h2><p>Snapshot từ Books, không bị giới hạn bởi khoảng ngày.</p></div></div><div className="inventory-report-grid"><div><span className="inventory-icon"><Icon name="book" size={16}/></span><b>{loading ? '—' : books.length}</b><small>Đầu sách</small></div><div><span className="inventory-icon inventory-green"><Icon name="layers" size={16}/></span><b>{loading ? '—' : stockCount}</b><small>Cuốn trong kho</small></div><div><span className="inventory-icon inventory-orange"><Icon name="clock" size={16}/></span><b>{loading ? '—' : lowStock}</b><small>Sách còn ≤ 5 cuốn</small></div><div><span className="inventory-icon inventory-red"><Icon name="filter" size={16}/></span><b>{loading ? '—' : noStock}</b><small>Sách hết hàng</small></div></div><div className="inventory-footer">{loading ? 'Đang tải danh mục…' : `${activeCategories} danh mục đang hoạt động`}</div></section>
}
