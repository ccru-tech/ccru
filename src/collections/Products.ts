import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { plural: 'Produtos', singular: 'Produto' },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', label: 'Nome', type: 'text', required: true, unique: true },
    {
      name: 'defaultUnit',
      label: 'Unidade de Medida Padrão',
      type: 'relationship',
      relationTo: 'units',
    },
    { name: 'defaultQuantity', label: 'Quantidade Padrão', type: 'number' },
    { name: 'defaultPrice', label: 'Valor Padrão', type: 'number' },
  ],
}
