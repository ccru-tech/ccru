import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
type Store = {
  phone: string
  setPhone: (phone: string) => void
  name: string
  setName: (name: string) => void
  location: string
  setLocation: (location: string) => void
}

export const useUsersStore = create<Store>()(
  persist(
    (set, get) => ({
      phone: '',
      setPhone: (phone) => set((state) => ({ ...state, phone })),
      name: '',
      setName: (name) => set((state) => ({ ...state, name })),
      location: '',
      setLocation: (location) => set((state) => ({ ...state, location })),
    }),
    { name: 'user-storage', storage: createJSONStorage(() => localStorage) },
  ),
)
