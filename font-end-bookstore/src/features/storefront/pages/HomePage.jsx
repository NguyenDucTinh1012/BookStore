import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import BookCard from '../components/BookCard.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/PageState.jsx'
import useStoreCatalog from '../hooks/useStoreCatalog.js'

export default function HomePage() {
  const { books, categories, loading, error, reload } = useStoreCatalog()
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').trim().toLocaleLowerCase('vi')
  const activeBooks = books.filter((book) => book.isActive)
  const filteredBooks = activeBooks.filter((book) => !query || `${book.title} ${book.author} ${book.categoryName || ''}`.toLocaleLowerCase('vi').includes(query))
  const featuredBooks = filteredBooks.filter((book) => Number(book.stock) > 0).slice(0, 8)
  const activeCategories = categories.filter((category) => category.isActive)

  return (
    <>
      <section className="store-hero"><div className="store-hero-copy"><span className="store-eyebrow"><i/> MỘT THẾ GIỚI ĐANG CHỜ BẠN</span><h1>Mỗi cuốn sách<br/>mở ra <em>một chân trời.</em></h1><p>Khám phá những câu chuyện, ý tưởng và hành trình mới được tuyển chọn dành riêng cho bạn.</p><div className="store-hero-actions"><Link className="store-button store-button-dark" to="/categories">Khám phá sách <Icon name="chevron" size={17}/></Link><a className="store-text-link" href="#featured">Xem sách nổi bật <span>↓</span></a></div><div className="store-hero-footnote"><span>✳</span> Đọc một chút mỗi ngày, lớn lên mỗi ngày.</div></div><div className="store-hero-art" aria-hidden="true"><div className="hero-sun"/><div className="hero-ring ring-one"/><div className="hero-ring ring-two"/><div className="hero-book-shape book-shape-one"/><div className="hero-book-shape book-shape-two"/><div className="hero-book-shape book-shape-three"/><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><span className="hero-art-note note-one">A GOOD<br/>STORY</span><span className="hero-art-note note-two">VOL. 01<br/>EST. 2025</span></div><div className="hero-bottom-label"><span>01 / 04</span><span>THE READING ROOM</span></div></section>

      <section className="store-category-section"><div className="store-section-heading"><div><span className="store-eyebrow">TÌM CUỐN SÁCH TIẾP THEO</span><h2>Khám phá theo danh mục</h2></div><Link to="/categories" className="store-inline-link">Tất cả danh mục <Icon name="chevron" size={16}/></Link></div>
        {loading ? <LoadingState label="Đang tải kệ sách..."/> : error ? <ErrorState message={error} onRetry={reload}/> : activeCategories.length ? <div className="store-category-grid">{activeCategories.slice(0, 4).map((category, index) => <Link to={`/categories/${category.categoryId}`} className={`store-category-tile tile-tone-${index % 4}`} key={category.categoryId}><span className="category-tile-index">0{index + 1}</span><span className="category-tile-icon"><Icon name={['bookOpen', 'layers', 'chart', 'book'][index % 4]} size={21}/></span><b>{category.categoryName}</b><small>{activeBooks.filter((book) => book.categoryId === category.categoryId).length} đầu sách</small><span className="category-tile-arrow"><Icon name="chevron" size={16}/></span></Link>)}</div> : <EmptyState title="Chưa có danh mục sách" description="Các danh mục sẽ xuất hiện ở đây khi cửa hàng cập nhật dữ liệu."/>}
      </section>

      <section className="store-featured-section" id="featured"><div className="store-section-heading"><div><span className="store-eyebrow">ĐƯỢC CHỌN CHO BẠN</span><h2>{query ? `Kết quả cho “${searchParams.get('q')}”` : 'Những cuốn sách nổi bật'}</h2></div><Link to="/categories" className="store-inline-link">Xem toàn bộ sách <Icon name="chevron" size={16}/></Link></div>
        {loading ? <LoadingState label="Đang tìm những cuốn sách hay..."/> : error ? <ErrorState message={error} onRetry={reload}/> : featuredBooks.length ? <div className="store-book-grid">{featuredBooks.map((book) => <BookCard key={book.bookId} book={book}/>)}</div> : <EmptyState title={query ? 'Không tìm thấy sách phù hợp' : 'Chưa có sách nổi bật'} description={query ? 'Thử tìm bằng tên sách hoặc tác giả khác nhé.' : 'Sách đang hoạt động sẽ xuất hiện tại đây.'}/>}</section>

      <section className="store-reading-note"><div className="reading-note-mark">“</div><p>“Một căn phòng không có sách giống như một cơ thể không có linh hồn.”</p><span>— CICERO</span><div className="reading-note-decoration">READ<br/>MORE.</div></section>
    </>
  )
}
