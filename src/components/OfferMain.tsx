'use client'

import { Offer } from '@/payload-types'
import { SidebarTrigger } from './ui/sidebar'
import { BasketCard, SinglesCard } from './ProductCards'
import { useEffect } from 'react'
import { useOrdersStore } from '@/lib/ordersStore'

export type OfferMainProps = { offer: Offer }

export default function OfferMain({ offer }: OfferMainProps) {
  const { setOffer } = useOrdersStore()
  useEffect(() => {
    if (offer) setOffer(offer)
  }, [offer])
  const now = new Date()
  const distributionDate = new Date(offer.distributionDate)
  const ordersMaxDate = new Date(offer.ordersMaxDate)
  return (
    <div className="container mx-auto px-4 py-8 bg-muted">
      <SidebarTrigger />
      <h1 className="font-black text-3xl md:text-5xl mb-4">CCRU Vila Prudente</h1>
      <div className="flex gap-8 mb-8 justify-between">
        <div className="grid gap-0">
          <p className="font-bold text-muted-foreground">Data de distribuição</p>
          <p className="font-medium text-lg">{distributionDate.toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="grid gap-0">
          <p className="font-bold text-sm text-muted-foreground">Pedidos até</p>
          <p className="">{ordersMaxDate.toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
      <h2 className="text-xl lg:text-4xl font-bold mb-4">Cestas</h2>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-8">
        {offer.baskets?.map((basket) => {
          return <BasketCard key={basket.id} basket={basket} />
        })}
      </div>
      <h2 className="text-xl lg:text-4xl font-bold mb-4">Avulsos</h2>
      <SinglesCard offer={offer} />
    </div>
  )
}
