import { Offer, Product, Unit } from '@/payload-types'
import { findIndex, sum } from 'lodash'
import { toast } from 'sonner'
import { create } from 'zustand'

type Item = {
  id: string
  title: string
  price: number
  multiplier: number
}

type Cart = {
  baskets: Item[]
  singles: Item[]
}

type Store = {
  count: number
  inc: () => void
  cart: Cart
  setCart: (cart: Cart) => void
  removeItem: (id: string, type: 'singles' | 'baskets') => void
  addItem: (item: any, type: 'singles' | 'baskets') => void
  offer: Offer | null
  setOffer: (offer: Offer) => void
  distributionPoint: number | 'Todos'
  setDistributionPoint: (value: string) => void
}

export const useOrdersStore = create<Store>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
  offer: null,
  setOffer: (offer: Offer) => set((state) => ({ ...state, offer })),
  cart: { baskets: [], singles: [] },
  setCart: (cart) => set((state) => ({ ...state, cart })),
  removeItem: (id, type) =>
    set((state) => {
      let items = [...state.cart[type]]
      let itemsIndex = findIndex(items, { id })

      toast(
        `${
          type === 'baskets' ? 'Cesta ' + items[itemsIndex].title : items[itemsIndex].title
        } foi removido.`,
        { position: 'top-right' },
      )
      if (items[itemsIndex].multiplier > 1) {
        items[itemsIndex].multiplier--
        return { ...state, cart: { ...state.cart, [type]: items } }
      } else {
        items = items.filter((item) => item.id !== id)
        return { ...state, cart: { ...state.cart, [type]: items } }
      }
    }),
  addItem: (item, type) =>
    set((state) => {
      let newCart = { ...state.cart }

      let itemTemp = { ...item }

      if (type === 'baskets') {
        delete itemTemp.items
        delete itemTemp.unit
      }
      if (type === 'singles') {
        if (!item.title) itemTemp.title = itemTemp.item.title
        delete itemTemp.item
        delete itemTemp.unit
        delete itemTemp.quantity
      }

      toast(`${itemTemp.title} foi adicionado ao carrinho.`, { position: 'top-right' })
      if (newCart[type].filter((i) => i.id === itemTemp.id).length > 0) {
        let indexOf = findIndex(newCart[type], { id: itemTemp.id })
        newCart[type][indexOf].multiplier++
        return { ...state, cart: newCart }
      } else {
        return {
          ...state,
          cart: {
            ...newCart,
            [type]: [...newCart[type], { ...itemTemp, multiplier: 1 }],
          },
        }
      }
    }),
  distributionPoint: 'Todos',
  setDistributionPoint: (value) =>
    set((state) => {
      return { ...state, distributionPoint: value === 'Todos' ? value : parseInt(value) }
    }),
}))

export function useTotalItems() {
  const { cart } = useOrdersStore()
  return sum(cart.baskets.map((i) => i.multiplier)) + sum(cart.singles.map((i) => i.multiplier))
}
