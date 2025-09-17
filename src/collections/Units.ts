import type { CollectionConfig } from 'payload'

export const Units: CollectionConfig = {
  slug: 'units',
  labels: { plural: 'Unidades de medida', singular: 'Unidade de medida' },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', label: 'Nome singular', type: 'text', required: true, unique: true },
    { name: 'title_plural', label: 'Nome plural', type: 'text', required: true, unique: true },
    { name: 'value', label: 'Abreviação', type: 'text', required: true, unique: true },
  ],
}
