import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { useAuth } from '../context/useAuth.js'
import AuthCard from '../components/AuthCard.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  async function handleSubmit(event) {
    event.preventDefault(); setSubmitting(true); setError('')
    try {
      const user = await login({ email, password })
      const next = searchParams.get('next')
      navigate(user.role === 'admin' ? (next?.startsWith('/admin') ? next : '/admin') : (next && !next.startsWith('/admin') ? next : '/'))
    } catch (loginError) { setError(loginError.message) }
    finally { setSubmitting(false) }
  }
  return <AuthCard title="Đăng nhập" subtitle="Đăng nhập để tiếp tục hành trình đọc của bạn." footer={<>Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link></>}><form className="auth-form" onSubmit={handleSubmit}><label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ban@email.com"/></label><label>Mật khẩu<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu"/></label>{error && <div className="auth-error" role="alert">{error}</div>}<button className="store-button store-button-dark auth-submit" disabled={submitting}>{submitting ? 'Đang đăng nhập…' : <>Đăng nhập <Icon name="chevron" size={16}/></>}</button></form></AuthCard>
}
