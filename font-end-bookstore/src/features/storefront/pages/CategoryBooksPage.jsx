import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { getBooksByCategory } from '../../books/api/booksApi.js'
import { getCategories } from '../../categories/api/categoriesApi.js'
import { getApiErrorMessage } from '../../../shared/utils/apiResponse.js'
import BookCard from '../components/BookCard.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/PageState.jsx'

export default function CategoryBooksPage() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let isCurrent = true
    Promise.all([getCategories(), getBooksByCategory(Number(categoryId))])
      .then(([categories, categoryBooks]) => {
        if (!isCurrent) return
        setCategory(categories.find((item) => item.categoryId === Number(categoryId)) || null)
        setBooks(categoryBooks.filter((book) => book.isActive))
      })
      .catch((requestError) => { if (isCurrent) setError(getApiErrorMessage(requestError)) })
      .finally(() => { if (isCurrent) setLoading(false) })
    return () => { isCurrent = false }
  }, [categoryId, version])

  const visibleBooks = useMemo(() => books.filter((book) => `${book.title} ${book.author}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi'))), [books, query])

  function retry() { setLoading(true); setError(''); setVersion((current) => current + 1) }

  return (
    <section className="store-catalog-page"><div className="store-breadcrumb"><Link to="/">Trang chủ</Link><Icon name="chevron" size={14}/><Link to="/categories">Danh mục sách</Link><Icon name="chevron" size={14}/><span>{category?.categoryName || 'Đang tải...'}</span></div><div className="store-page-intro store-category-intro"><div><span className="store-eyebrow">DANH MỤC SÁCH</span><h1>{category?.categoryName || 'Sách trong danh mục'}</h1><p>{category?.description || 'Chọn một cuốn sách để xem thông tin và tình trạng còn hàng.'}</p></div><label className="store-inline-search"><Icon name="search" size={17}/><input placeholder="Tìm sách trong danh mục..." value={query} onChange={(event) => setQuery(event.target.value)}/></label></div>{loading ? <LoadingState label="Đang tải sách trong danh mục..."/> : error ? <ErrorState message={error} onRetry={retry}/> : visibleBooks.length ? <div className="store-book-grid">{visibleBooks.map((book) => <BookCard key={book.bookId} book={book}/>)}</div> : <EmptyState title={query ? 'Không tìm thấy sách' : 'Danh mục chưa có sách'} description={query ? 'Thử một từ khóa khác.' : 'Sách sẽ xuất hiện khi được gán vào danh mục này.'}/>}</section>
  )
}
