import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app/AppRoutes.jsx'
import AuthProvider from './features/auth/context/AuthProvider.jsx'
import CartProvider from './features/cart/context/CartContext.jsx'

export default function App() {
  return <BrowserRouter><AuthProvider><CartProvider><AppRoutes/></CartProvider></AuthProvider></BrowserRouter>
}
