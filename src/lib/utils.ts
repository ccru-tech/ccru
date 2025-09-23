import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CollectionSlug, LabelFunction, StaticLabel } from 'payload'
import { Offer, Order } from '@/payload-types'
import { find } from 'lodash'

export function createRowLabel({
  defaultLabel,
  path,
  relationTo,
}: {
  defaultLabel: LabelFunction | StaticLabel
  path: string
  relationTo?: CollectionSlug
}) {
  return {
    path: '@/collections/components/row-label',
    clientProps: {
      defaultLabel: defaultLabel,
      path: path,
      relationTo: relationTo,
    },
  }
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const processOrderArray = (
  offer: Offer,
  orders: Order[],
  collection: 'singles' | 'baskets',
) => {
  let itemsMap: { [key: string]: number } = {}
  orders.forEach((order) => {
    order[collection]?.forEach((item) => {
      if (itemsMap[item.itemId]) {
        itemsMap[item.itemId] += item.multiplier
      } else {
        itemsMap[item.itemId] = item.multiplier
      }
    })
  })
  let items = Object.keys(itemsMap).map((id) => {
    return { ...find(offer[collection] as any, { id }), multiplier: itemsMap[id] }
  })
  return items
}
