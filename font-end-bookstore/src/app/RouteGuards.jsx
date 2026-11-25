import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth/context/useAuth.js'

export function RequireCustomerSession({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace/>
  return children
}

export function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (user?.role !== 'admin') {
    return <Navigate to={user ? '/' : '/login?next=%2Fadmin'} replace/>
  }
  return children
}
