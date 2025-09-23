import { createRowLabel } from '@/lib/utils'
import type { CollectionConfig } from 'payload'
import { updateFields } from './functions/update-fields'

export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { plural: 'Ofertas', singular: 'Oferta' },
  admin: {
    useAsTitle: 'distributionDate',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'ordersMaxDate',
          label: 'Pedidos até o dia',

          required: true,
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'd MMM yyy',
            },
          },
        },
        {
          name: 'distributionDate',
          label: 'Data de distribuição dos pedidos',
          required: true,
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'd MMM yyy',
            },
          },
        },
      ],
    },
    {
      name: 'distribution_points',
      label: { plural: 'Pontos de Distribuição', singular: 'Ponto de Distribuição' },
      type: 'relationship',
      relationTo: 'distributionPoints',
      defaultValue: [1, 2, 3, 4],
      hasMany: true,
    },
    // Cestas
    {
      name: 'baskets',
      label: 'Cestas',
      type: 'array',
      labels: {
        singular: 'Cesta',
        plural: 'Cestas',
      },
      admin: {
        initCollapsed: false,
        components: {
          RowLabel: '@/collections/Offers/components/row-label#BasketRowLabel',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', label: 'Nome', type: 'text', required: true },
            { name: 'price', label: 'Preço', type: 'number', required: true },
          ],
        },
        {
          name: 'items',
          label: 'Itens da cesta',
          type: 'array',
          labels: {
            singular: 'Item',
            plural: 'Itens',
          },
          minRows: 1,
          admin: {
            components: {
              RowLabel: {
                path: '@/collections/Offers/components/row-label#ItemRowLabel',
                clientProps: {
                  defaultLabel: 'Item',
                  path: 'item.title',
                  relationTo: 'products',
                },
              },
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'item',
                  type: 'relationship',
                  relationTo: 'products',
                },
                {
                  name: 'unit',
                  label: 'Unidade de medida',
                  type: 'relationship',
                  relationTo: 'units',
                  required: true,
                  hooks: {
                    afterChange: [
                      (props: any) => {
                        updateFields(props)
                      },
                    ],
                  },
                  admin: {
                    components: {
                      Field:
                        '@/collections/Offers/components/CustomInputOne#CustomRelationshipFieldUnit',
                    },
                  },
                },
                {
                  name: 'quantity',
                  label: 'Quantidade',
                  type: 'number',
                  required: true,
                  hooks: {
                    afterChange: [
                      (props: any) => {
                        updateFields(props)
                      },
                    ],
                  },
                  admin: {
                    components: {
                      Field:
                        '@/collections/Offers/components/CustomInputOne#CustomNumberFieldQuantity',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // Avulsos
    {
      name: 'singles',
      label: 'Avulsos',
      type: 'array',
      labels: {
        singular: 'Avulso',
        plural: 'Avulsos',
      },
      minRows: 1,
      admin: {
        components: {
          RowLabel: {
            path: '@/collections/Offers/components/row-label#ItemRowLabel',
            clientProps: {
              defaultLabel: 'Item',
              path: 'item.title',
              relationTo: 'products',
            },
          },
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'item',
              type: 'relationship',
              relationTo: 'products',
            },
            {
              name: 'unit',
              label: 'Unidade de medida',
              type: 'relationship',
              relationTo: 'units',
              required: true,
              hooks: {
                afterChange: [
                  (props: any) => {
                    updateFields(props)
                  },
                ],
              },
              admin: {
                components: {
                  Field:
                    '@/collections/Offers/components/CustomInputOne#CustomRelationshipFieldUnit',
                },
              },
            },
            {
              name: 'quantity',
              label: 'Quantidade',
              type: 'number',
              required: true,
              hooks: {
                afterChange: [
                  (props: any) => {
                    updateFields(props)
                  },
                ],
              },
              admin: {
                components: {
                  Field: '@/collections/Offers/components/CustomInputOne#CustomNumberFieldQuantity',
                },
              },
            },
            {
              name: 'price',
              label: 'Preço',
              type: 'number',
              required: true,
              hooks: {
                afterChange: [
                  (props: any) => {
                    updateFields(props)
                  },
                ],
              },
              admin: {
                components: {
                  Field: '@/collections/Offers/components/CustomInputOne#CustomNumberFieldPrice',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
