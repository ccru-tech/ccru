import type { CollectionConfig } from 'payload'

export const DistributionPoints: CollectionConfig = {
  slug: 'distributionPoints',
  labels: { plural: 'Pontos de Distribuição', singular: 'Ponto de Distribuição' },
  admin: {
    useAsTitle: 'title',
  },
  fields: [{ name: 'title', label: 'Nome', type: 'text', required: true, unique: true }],
}
