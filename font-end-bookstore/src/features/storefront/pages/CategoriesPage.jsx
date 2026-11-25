import { Link } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/PageState.jsx'
import useStoreCatalog from '../hooks/useStoreCatalog.js'

export default function CategoriesPage() {
  const { books, categories, loading, error, reload } = useStoreCatalog()
  const activeCategories = categories.filter((category) => category.isActive)
  const activeBooks = books.filter((book) => book.isActive)

  return (
    <section className="store-catalog-page"><div className="store-page-intro"><span className="store-eyebrow">THE BOOK COLLECTION</span><h1>Danh mục sách</h1><p>Từ những câu chuyện dịu dàng đến kiến thức mở lối — tìm một góc đọc hợp với bạn.</p></div>{loading ? <LoadingState label="Đang tải danh mục..."/> : error ? <ErrorState message={error} onRetry={reload}/> : activeCategories.length ? <div className="store-category-grid store-category-grid-large">{activeCategories.map((category, index) => { const count = activeBooks.filter((book) => book.categoryId === category.categoryId).length; return <Link to={`/categories/${category.categoryId}`} className={`store-category-tile tile-tone-${index % 4}`} key={category.categoryId}><span className="category-tile-index">{String(index + 1).padStart(2, '0')}</span><span className="category-tile-icon"><Icon name={['bookOpen', 'layers', 'chart', 'book'][index % 4]} size={21}/></span><b>{category.categoryName}</b><small>{count} đầu sách</small><span className="category-tile-arrow"><Icon name="chevron" size={16}/></span></Link> })}</div> : <EmptyState title="Chưa có danh mục" description="Danh mục sẽ xuất hiện sau khi được thêm vào cửa hàng."/>}</section>
  )
}
