import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AdminApp from './AdminApp.jsx'
import { RequireAdmin, RequireCustomerSession } from './RouteGuards.jsx'
import StorefrontLayout from '../components/layout/StorefrontLayout.jsx'
import HomePage from '../features/storefront/pages/HomePage.jsx'
import CategoriesPage from '../features/storefront/pages/CategoriesPage.jsx'
import CategoryBooksPage from '../features/storefront/pages/CategoryBooksPage.jsx'
import BookDetailsPage from '../features/storefront/pages/BookDetailsPage.jsx'
import CartPage from '../features/cart/pages/CartPage.jsx'
import CheckoutPage from '../features/cart/pages/CheckoutPage.jsx'
import LoginPage from '../features/auth/pages/LoginPage.jsx'
import RegisterPage from '../features/auth/pages/RegisterPage.jsx'
import CustomerOrdersPage from '../features/customerOrders/pages/CustomerOrdersPage.jsx'
import CustomerOrderDetailsPage from '../features/customerOrders/pages/CustomerOrderDetailsPage.jsx'
import '../features/orders/orders.css'

function Storefront() { return <StorefrontLayout><Outlet/></StorefrontLayout> }

export default function AppRoutes() {
  return <Routes>
    <Route element={<Storefront/>}>
      <Route index element={<HomePage/>}/>
      <Route path="categories" element={<CategoriesPage/>}/>
      <Route path="categories/:categoryId" element={<CategoryBooksPage/>}/>
      <Route path="books/:bookId" element={<BookDetailsPage/>}/>
      <Route path="cart" element={<CartPage/>}/>
      <Route path="checkout" element={<RequireCustomerSession><CheckoutPage/></RequireCustomerSession>}/>
      <Route path="orders" element={<RequireCustomerSession><CustomerOrdersPage/></RequireCustomerSession>}/>
      <Route path="orders/:orderId" element={<RequireCustomerSession><CustomerOrderDetailsPage/></RequireCustomerSession>}/>
    </Route>
    <Route path="login" element={<LoginPage/>}/>
    <Route path="register" element={<RegisterPage/>}/>
    <Route path="admin/*" element={<RequireAdmin><AdminApp/></RequireAdmin>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}
