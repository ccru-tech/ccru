import { Product, Unit } from '@/payload-types'
import { findIndex } from 'lodash'
import { create } from 'zustand'

type Cart = {
  baskets: { id: string; title: string; price: number; multiplier: number }[]
  singles: {
    id: string
    item: Product
    unit: Unit
    quantity: number
    price: number
    multiplier: number
  }[]
}

type Store = {
  count: number
  inc: () => void
  cart: Cart
  setCart: (cart: Cart) => void
  removeItem: (id: string, type: 'singles' | 'baskets') => void
  addBasket: (basket: any) => void
  addSingle: (single: any) => void
}

export const useOrdersStore = create<Store>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
  cart: { baskets: [], singles: [] },
  setCart: (cart) => set((state) => ({ ...state, cart })),
  removeItem: (id, type) =>
    set((state) => {
      let items = [...state.cart[type]]
      let itemsIndex = findIndex(items, { id })

      if (items[itemsIndex].multiplier > 1) {
        items[itemsIndex].multiplier--
        return { ...state, cart: { ...state.cart, [type]: items } }
      } else {
        items = items.filter((item) => item.id !== id)
        return { ...state, cart: { ...state.cart, [type]: items } }
      }
    }),
  addBasket: (basket) =>
    set((state) => {
      let basketTemp = { ...basket }
      delete basketTemp.items
      delete basketTemp.unit
      let newCart = { ...state.cart }
      if (newCart.baskets.filter((i) => i.id === basketTemp.id).length > 0) {
        let indexOf = findIndex(newCart.baskets, { id: basketTemp.id })
        newCart.baskets[indexOf].multiplier++
        return { ...state, cart: newCart }
      } else {
        return {
          ...state,
          cart: {
            ...state.cart,
            baskets: [...state.cart.baskets, { ...basketTemp, multiplier: 1 }],
          },
        }
      }
    }),
  addSingle: (item) =>
    set((state) => {
      let newCart = { ...state.cart }
      if (state.cart.singles.filter((i) => i.id === item.id).length > 0) {
        let indexOf = findIndex(state.cart.singles, { id: item.id })
        newCart.singles[indexOf].multiplier++
        return { ...state, cart: newCart }
      } else {
        return {
          ...state,
          cart: { ...state.cart, singles: [...state.cart.singles, { ...item, multiplier: 1 }] },
        }
      }
    }),
}))
