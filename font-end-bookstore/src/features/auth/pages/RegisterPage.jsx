import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../../components/ui/Icon.jsx'
import { useAuth } from '../context/useAuth.js'
import AuthCard from '../components/AuthCard.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'customer' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  function update(field, value) { setForm((current) => ({ ...current, [field]: value })) }
  async function handleSubmit(event) {
    event.preventDefault(); setError('')
    if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận chưa khớp.'); return }
    setSubmitting(true)
    try { const user = await register(form); navigate(user.role === 'admin' ? '/admin' : '/') }
    catch (registerError) { setError(registerError.message) }
    finally { setSubmitting(false) }
  }
  return <AuthCard title="Tạo tài khoản" subtitle="Lưu lại những cuốn sách yêu thích và theo dõi đơn mua." footer={<>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></>}><form className="auth-form" onSubmit={handleSubmit}><label>Họ và tên<input required maxLength={100} autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Tên của bạn"/></label><label>Email<input required type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="ban@email.com"/></label><label>Mật khẩu<input required minLength={6} type="password" autoComplete="new-password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="Ít nhất 6 ký tự"/></label><label>Xác nhận mật khẩu<input required minLength={6} type="password" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} placeholder="Nhập lại mật khẩu"/></label><label>Loại tài khoản<select value={form.role} onChange={(event) => update('role', event.target.value)}><option value="customer">Khách hàng</option><option value="admin">Quản trị viên</option></select></label><div className="auth-demo-warning">Vai trò chỉ dùng cho giao diện demo trên trình duyệt này.</div>{error && <div className="auth-error" role="alert">{error}</div>}<button className="store-button store-button-dark auth-submit" disabled={submitting}>{submitting ? 'Đang tạo tài khoản…' : <>Tạo tài khoản <Icon name="chevron" size={16}/></>}</button></form></AuthCard>
}
