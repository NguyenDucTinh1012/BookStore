import Icon from '../../../components/ui/Icon.jsx'

export default function CategoryStats({ categories, loading }) {
  const activeCount = categories.filter((category) => category.isActive).length
  const hiddenCount = categories.length - activeCount

  return (
    <section className="stats-grid" aria-label="Thống kê danh mục">
      <article className="stat-card">
        <div className="stat-top"><span className="stat-icon lavender"><Icon name="layers" size={19}/></span><span className="stat-note">Tổng quan</span></div>
        <div className="stat-value">{loading ? '—' : categories.length}</div>
        <div className="stat-caption">Tổng danh mục</div><div className="stat-decoration decor-purple"/>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span className="stat-icon mint"><Icon name="check" size={19}/></span><span className="stat-trend">Đang hiển thị</span></div>
        <div className="stat-value">{loading ? '—' : activeCount}</div>
        <div className="stat-caption">Danh mục hoạt động</div><div className="stat-decoration decor-green"/>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span className="stat-icon amber"><Icon name="clock" size={19}/></span><span className="stat-note">Có thể kích hoạt</span></div>
        <div className="stat-value">{loading ? '—' : hiddenCount}</div>
        <div className="stat-caption">Đang ẩn</div><div className="stat-decoration decor-orange"/>
      </article>
      <article className="stat-card feature-stat">
        <div className="feature-orb orb-one"/><div className="feature-orb orb-two"/>
        <span className="feature-kicker">GỢI Ý NHỎ</span>
        <h3>Một kệ sách<br/>ngăn nắp bắt đầu<br/>từ đây.</h3>
        <span className="feature-spark">✦</span><span className="feature-book">▰</span>
      </article>
    </section>
  )
}
