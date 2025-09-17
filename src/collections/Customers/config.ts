import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: { plural: 'Compradores', singular: 'Comprador' },
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true, // default: false
      requireEmail: false, // default: false
    },
  },
  fields: [
    { name: 'username', label: 'Nome de usuário', type: 'text' },
    { name: 'full_name', label: 'Nome completo', type: 'text' },
  ],
}
