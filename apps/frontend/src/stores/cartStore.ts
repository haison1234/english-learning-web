// ── Cart Store ──
// Quản lý trạng thái giỏ hàng với localStorage persistence
import { createContext, useContext, useState, useEffect, ReactNode, createElement } from 'react'

export interface CartItem {
  courseId: string
  title: string
  basePrice: number
  thumbnailUrl: string | null
  courseType: number // 0: FREE, 1: PREMIUM
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (courseId: string) => void
  clearCart: () => void
  isInCart: (courseId: string) => boolean
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'el_cart_v1'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.courseId === item.courseId)) return prev
      return [...prev, item]
    })
  }

  const removeItem = (courseId: string) => {
    setItems((prev) => prev.filter((i) => i.courseId !== courseId))
  }

  const clearCart = () => setItems([])

  const isInCart = (courseId: string) => items.some((i) => i.courseId === courseId)

  const totalItems = items.length
  const totalPrice = items.reduce((sum, i) => sum + i.basePrice, 0)

  return createElement(
    CartContext.Provider,
    { value: { items, addItem, removeItem, clearCart, isInCart, totalItems, totalPrice } },
    children
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
