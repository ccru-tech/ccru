import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { plural: 'Pedidos', singular: 'Pedidos' },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'phone', label: 'Telefone', type: 'text', required: true },
    {
      name: 'distributionPoint',
      label: 'Ponto de Distribuição',
      type: 'relationship',
      relationTo: 'distributionPoints',
      required: true,
    },
    {
      name: 'offer',
      label: 'Oferta',
      type: 'relationship',
      relationTo: 'offers',
      required: true,
    },
    {
      name: 'baskets',
      label: 'Cestas',
      type: 'array',
      fields: [
        { name: 'itemId', type: 'text', required: true },
        { name: 'multiplier', type: 'number', required: true },
      ],
    },
    {
      name: 'singles',
      label: 'Avulsos',
      type: 'array',
      fields: [
        { name: 'itemId', type: 'text', required: true },
        { name: 'multiplier', type: 'number', required: true },
      ],
    },
  ],
}
