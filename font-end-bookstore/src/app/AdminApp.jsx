import { useEffect, useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import Toast from '../components/ui/Toast.jsx'
import BooksPage from '../features/books/pages/BooksPage.jsx'
import CategoriesPage from '../features/categories/pages/CategoriesPage.jsx'
import OrderDetailsPage from '../features/orderDetails/pages/OrderDetailsPage.jsx'
import OrdersPage from '../features/orders/pages/OrdersPage.jsx'
import ReportsPage from '../features/reports/pages/ReportsPage.jsx'
import '../styles/admin.css'

export default function AdminApp() {
  const [section, setSection] = useState('categories')
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (!toastMessage) return undefined
    const timeoutId = window.setTimeout(() => setToastMessage(''), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  function renderPage() {
    switch (section) {
      case 'books':
        return <BooksPage onToast={setToastMessage}/>
      case 'orders':
        return <OrdersPage onToast={setToastMessage}/>
      case 'orderDetails':
        return <OrderDetailsPage/>
      case 'reports':
        return <ReportsPage/>
      case 'categories':
      default:
        return <CategoriesPage onToast={setToastMessage}/>
    }
  }

  return (
    <>
      <AdminLayout section={section} onNavigate={setSection}>
        {renderPage()}
      </AdminLayout>
      <Toast message={toastMessage}/>
    </>
  )
}
