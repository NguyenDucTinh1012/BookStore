import Icon from '../../../components/ui/Icon.jsx'

export default function BookStats({ books, loading }) {
  const activeBooks = books.filter((book) => book.isActive).length
  const lowStockBooks = books.filter((book) => book.stock <= 5).length

  return (
    <section className="stats-grid books-stats" aria-label="Thống kê sách">
      <article className="stat-card"><div className="stat-top"><span className="stat-icon lavender"><Icon name="book" size={19}/></span><span className="stat-note">Trong kho</span></div><div className="stat-value">{loading ? '—' : books.length}</div><div className="stat-caption">Tổng đầu sách</div><div className="stat-decoration decor-purple"/></article>
      <article className="stat-card"><div className="stat-top"><span className="stat-icon mint"><Icon name="check" size={19}/></span><span className="stat-trend">Đang hiển thị</span></div><div className="stat-value">{loading ? '—' : activeBooks}</div><div className="stat-caption">Sách đang hoạt động</div><div className="stat-decoration decor-green"/></article>
      <article className="stat-card"><div className="stat-top"><span className="stat-icon amber"><Icon name="filter" size={19}/></span><span className="stat-note">Tồn kho ≤ 5</span></div><div className="stat-value">{loading ? '—' : lowStockBooks}</div><div className="stat-caption">Sách sắp hết hàng</div><div className="stat-decoration decor-orange"/></article>
      <article className="stat-card feature-stat"><div className="feature-orb orb-one"/><div className="feature-orb orb-two"/><span className="feature-kicker">KHO SÁCH</span><h3>Mỗi cuốn sách<br/>đều có một chỗ<br/>trên kệ.</h3><span className="feature-spark">✦</span><span className="feature-book">▰</span></article>
    </section>
  )
}
