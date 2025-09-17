'use client'

import { useRowLabel } from '@payloadcms/ui'
import { CollectionSlug, LabelFunction, StaticLabel } from 'payload'
import React, { useEffect, useState } from 'react'

export const ItemRowLabel = ({
  defaultLabel,
  path,
  relationTo,
}: {
  defaultLabel: LabelFunction | StaticLabel
  path: string
  relationTo?: CollectionSlug
}) => {
  const [label, setLabel] = useState<React.ReactNode | string | null>(null)
  const [prevData, setPrevData] = useState<any | null>(null)

  const { data, rowNumber } = useRowLabel<any>()
  useEffect(() => {
    if (relationTo && JSON.stringify(data) !== JSON.stringify(prevData)) {
      fetchLabel()
    }
  }, [data])
  const fetchLabel = async () => {
    const [field, property] = path.split('.')
    if (data[field]) {
      try {
        const itemTitle = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${relationTo}/${data[field]}`,
        )
          .then((res) => res.json())
          .then((res) => {
            return res[property]
          })
        const itemUnit = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/units/${data.unit}`)
          .then((res) => res.json())
          .then((res) => {
            return res.value
          })
        if (itemTitle && data.quantity && itemUnit)
          setLabel(
            <p style={{ fontSize: '14px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span>
                <span style={{ fontWeight: 600 }}>{`${itemTitle}`}</span>
                {` - ${data.quantity} ${itemUnit}`}
              </span>
              {data.price ? (
                <span
                  style={{
                    background: 'rgba(0,0,0,0.07)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >{`${new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(data.price)}`}</span>
              ) : null}
            </p>,
          )
        setPrevData(data)
      } catch (e) {
        console.log('Failed to fetch')
      }
    }
  }
  if (label) return label

  return `Item ${String(rowNumber).padStart(2, '0')}`
}

export const BasketRowLabel = () => {
  const { data, rowNumber } = useRowLabel<any>()
  if (!data) return `Cesta ${String(rowNumber).padStart(2, '0')}`

  return (
    <p style={{ fontSize: '14px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <span>
        <span style={{ fontWeight: 600 }}>
          {data.items ? 'Cesta ' : ''} {data.title}
        </span>
        {data.items ? ` (${data.items.length} ${data.items.length > 1 ? 'itens' : 'item'})` : ''}
      </span>
      <span
        style={{ background: 'rgba(0,0,0,0.07)', padding: '2px 8px', borderRadius: '4px' }}
      >{`${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(data.price)}`}</span>
    </p>
  )
}
