import { useEffect, useState } from 'react'
import CartContext from './cartContext.js'

const CART_KEY = 'bookstore.cart.v1'

function getSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState(getSavedCart)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  function addItem(bookId, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.bookId === Number(bookId))
      if (existing) return current.map((item) => item.bookId === Number(bookId) ? { ...item, quantity: item.quantity + Number(quantity) } : item)
      return [...current, { bookId: Number(bookId), quantity: Number(quantity) }]
    })
  }

  function updateQuantity(bookId, quantity) {
    const nextQuantity = Number(quantity)
    if (nextQuantity <= 0) {
      removeItem(bookId)
      return
    }
    setItems((current) => current.map((item) => item.bookId === Number(bookId) ? { ...item, quantity: nextQuantity } : item))
  }

  function removeItem(bookId) {
    setItems((current) => current.filter((item) => item.bookId !== Number(bookId)))
  }

  function clearCart() { setItems([]) }

  const value = {
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

