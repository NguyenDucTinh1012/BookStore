import { useState } from 'react'
import Icon from '../ui/Icon.jsx'

const navigationItems = [
  { key: 'books', label: 'Sách', icon: 'book' },
  { key: 'categories', label: 'Danh mục', icon: 'layers' },
  { key: 'orders', label: 'Đơn hàng', icon: 'shopping' },
  { key: 'orderDetails', label: 'Chi tiết đơn hàng', icon: 'bookOpen' },
  { key: 'reports', label: 'Báo cáo & thống kê', icon: 'chart' },
]

export default function AdminLayout({ section, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageTitle = navigationItems.find((item) => item.key === section)?.label || 'Quản trị'

  return (
    <div className="admin-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#home" aria-label="BookStore Admin"><span className="brand-mark"><Icon name="bookOpen" size={22}/></span><span className="brand-copy"><strong>BookStore</strong><small>QUẢN TRỊ CỬA HÀNG</small></span></a>
        <div className="workspace-switcher"><span className="workspace-avatar">B</span><span><b>BookStore</b><small>Cửa hàng chính</small></span><Icon name="down" size={16}/></div>
        <div className="nav-label">QUẢN LÝ DỮ LIỆU</div>
        <nav className="main-nav" aria-label="Điều hướng chính">{navigationItems.map((item) => <button key={item.key} type="button" aria-current={section === item.key ? 'page' : undefined} className={`nav-link ${section === item.key ? 'active' : ''}`} onClick={() => { onNavigate(item.key); setSidebarOpen(false) }}><Icon name={item.icon} size={19}/><span>{item.label}</span></button>)}</nav>
        <div className="sidebar-bottom"><div className="sidebar-help"><span className="help-icon">✳</span><b>Quản lý gọn gàng</b><p>Danh mục, sách và đơn hàng được kết nối trong cùng một cửa hàng.</p></div><div className="profile"><div className="profile-avatar">AD</div><span><b>Quản trị viên</b><small>BookStore</small></span><button className="profile-more" aria-label="Tùy chọn tài khoản">•••</button></div></div>
      </aside>

      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Đóng menu" onClick={() => setSidebarOpen(false)}/>}
      <div className="main-area">
        <header className="topbar"><button className="mobile-menu icon-button" aria-label="Mở menu" onClick={() => setSidebarOpen(true)}><Icon name="menu"/></button><div className="breadcrumbs"><span>Quản lý cửa hàng</span><Icon name="chevron" size={15}/><b>{pageTitle}</b></div><div className="topbar-right"><span className="today"><Icon name="clock" size={16}/>{new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span><button className="icon-button notification" aria-label="Thông báo"><Icon name="bell" size={19}/><i/></button><div className="top-avatar">AD</div></div></header>
        {children}
      </div>
    </div>
  )
}
