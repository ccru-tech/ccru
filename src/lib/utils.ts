import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { CollectionSlug, LabelFunction, StaticLabel } from 'payload'

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
