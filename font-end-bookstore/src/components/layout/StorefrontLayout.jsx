import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon.jsx'
import { useAuth } from '../../features/auth/context/useAuth.js'
import { useCart } from '../../features/cart/context/useCart.js'
import '../../styles/storefront.css'

export default function StorefrontLayout() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  function submitSearch(event) {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/?q=${encodeURIComponent(query)}` : '/')
  }

  function signOut() {
    logout()
    navigate('/')
  }

  const isHome = location.pathname === '/'

  return (
    <div className="storefront">
      <div className="store-announcement"><span>Góc đọc của bạn, luôn có một cuốn sách hay.</span><span>Miễn phí vận chuyển cho đơn từ 500.000₫</span></div>
      <header className="store-header">
        <Link to="/" className="store-brand"><span className="store-brand-mark"><Icon name="bookOpen" size={22}/></span><span><b>BookStore</b><small>ĐỌC ĐỂ LỚN LÊN</small></span></Link>
        <nav className="store-main-nav" aria-label="Điều hướng cửa hàng"><Link className={isHome ? 'selected' : ''} to="/">Trang chủ</Link><Link className={location.pathname.startsWith('/categories') ? 'selected' : ''} to="/categories">Danh mục sách</Link><Link to="/#featured">Sách nổi bật</Link></nav>
        <form className="store-search" onSubmit={submitSearch}><Icon name="search" size={18}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm sách, tác giả..." aria-label="Tìm sách"/><button aria-label="Tìm kiếm"><Icon name="chevron" size={16}/></button></form>
        <div className="store-header-actions"><Link className="store-cart-link" to="/cart" aria-label={`Giỏ hàng, ${itemCount} sản phẩm`}><Icon name="shopping" size={20}/><span>Giỏ hàng</span>{itemCount > 0 && <i>{itemCount}</i>}</Link>{user ? <div className="store-user-menu"><span className="store-user-avatar">{user.name.slice(0, 1).toLocaleUpperCase('vi')}</span><div><b>{user.name}</b><small>{user.role === 'admin' ? 'Quản trị viên' : 'Tài khoản của tôi'}</small></div><button className="store-user-more" onClick={signOut}>Thoát</button>{user.role === 'admin' && <Link className="admin-shortcut" to="/admin">Quản trị</Link>}</div> : <div className="store-auth-links"><Link to="/login">Đăng nhập</Link><Link className="store-register-link" to="/register">Tạo tài khoản</Link></div>}</div>
      </header>
      <main className="store-main"><Outlet/></main>
      <footer className="store-footer"><div className="store-footer-brand"><span className="store-brand-mark"><Icon name="bookOpen" size={21}/></span><div><b>BookStore</b><small>Thêm một trang sách, thêm một hành trình.</small></div></div><div className="store-footer-links"><Link to="/categories">Danh mục</Link><Link to="/cart">Giỏ hàng</Link>{user && <Link to="/orders">Đơn mua</Link>}</div><span className="store-footer-copy">© {new Date().getFullYear()} BookStore</span></footer>
    </div>
  )
}
