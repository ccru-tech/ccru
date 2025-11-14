'use client'

import { Offer } from '@/payload-types'
import { SidebarTrigger } from './ui/sidebar'
import { BasketCard, SinglesCard } from './ProductCards'
import { useEffect } from 'react'
import { useOrdersStore } from '@/lib/ordersStore'
import { cn } from '@/lib/utils'

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
    <div className="container mx-auto px-4 py-4 pb-16 bg-muted">
      <SidebarTrigger />
      <img
        src="https://static.wixstatic.com/media/84a241_22441e0523ec4146a0ff9ece3cd78cda~mv2.png/v1/fill/w_298,h_298,al_c,lg_1,q_85,enc_avif,quality_auto/84a241_22441e0523ec4146a0ff9ece3cd78cda~mv2.png"
        alt="Coletivo CRU"
        className="w-24"
      />{' '}
      <h1 className="font-bold text-xl">Compra coletiva</h1>
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
      <h2 className="text-lg font-bold mb-2">Cestas</h2>
      <div
        className={cn(
          'grid gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-8',
          now > distributionDate && 'pointer-events-none',
        )}
      >
        {offer.baskets?.map((basket) => {
          return <BasketCard key={basket.id} basket={basket} />
        })}
      </div>
      <h2 className="text-lg font-bold mb-2">Avulsos</h2>
      <SinglesCard offer={offer} />
    </div>
  )
}
