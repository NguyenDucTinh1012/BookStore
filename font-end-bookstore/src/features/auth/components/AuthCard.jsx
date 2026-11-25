import { Link } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'

export default function AuthCard({ title, subtitle, footer, children }) {
  return <main className="auth-page"><div className="auth-back-link"><Link to="/"><Icon name="chevron" size={15}/> Trở về cửa hàng</Link></div><section className="auth-card"><Link to="/" className="store-brand auth-brand"><span className="store-brand-mark"><Icon name="bookOpen" size={22}/></span><span><b>BookStore</b><small>GÓC ĐỌC CỦA BẠN</small></span></Link><span className="store-eyebrow">CHÀO MỪNG BẠN ĐẾN VỚI BOOKSTORE</span><h1>{title}</h1><p className="auth-subtitle">{subtitle}</p>{children}<div className="auth-footer">{footer}</div><div className="auth-local-note"><Icon name="info" size={15}/> Tài khoản demo được lưu trên trình duyệt hiện tại.</div></section><div className="auth-side-quote"><span>“</span><p>Sách là tấm gương:<br/>bạn chỉ nhìn thấy trong đó<br/>những gì bạn đã có bên trong.</p><small>— CARLOS RUIZ ZAFÓN</small><div className="auth-side-art"><div/><div/><div/></div></div></main>
}
