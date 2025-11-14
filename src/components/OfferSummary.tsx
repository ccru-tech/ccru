'use client'

import { Offer, Product } from '@/payload-types'
import { Card, CardContent } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type OfferSummaryProps = { offer: Offer }

export default function OfferSummary({ offer }: OfferSummaryProps) {
  const now = new Date()
  const distributionDate = new Date(offer.distributionDate)
  const ordersMaxDate = new Date(offer.ordersMaxDate)
  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="lg:h-20 px-4 items-center flex">
          <div className="grid lg:flex gap-4 lg:justify-between lg:items-center w-full">
            <div className="grid gap-4 lg:flex lg:gap-12 lg:items-center">
              <img
                src="https://static.wixstatic.com/media/84a241_22441e0523ec4146a0ff9ece3cd78cda~mv2.png/v1/fill/w_298,h_298,al_c,lg_1,q_85,enc_avif,quality_auto/84a241_22441e0523ec4146a0ff9ece3cd78cda~mv2.png"
                alt="Coletivo CRU"
                className="h-20"
              />
              <div>
                <h3 className="uppercase text-[10px] text-muted-foreground mb-0.5">
                  <span>Entrega do dia</span>
                </h3>
                <h2 className="font-bold text-xl">
                  {distributionDate.toLocaleDateString('pt-BR')}
                </h2>
              </div>
              <div>
                <h3 className="uppercase text-[10px] text-muted-foreground mb-2.5">
                  <span>Pontos de distribuição</span>
                </h3>
                <p className="text-sm font-semibold">
                  {offer.distribution_points
                    ?.map((point) => (typeof point !== 'number' ? point.title : point))
                    .join(', ')}
                </p>
              </div>
            </div>
            <Link href={`/ofertas/${offer.id}`}>
              <Button variant={'outline'} className="cursor-pointer w-full lg:w-max h-12 mb-3">
                Conferir oferta <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

{
  /* <ScrollArea className="p-4 w-full lg:h-[calc(100svh-16rem-2px)]">
          <h3 className="uppercase text-[10px] text-muted-foreground mb-1">
            <span>Cestas</span>
          </h3>
          <ul className="flex flex-col gap-5 mb-5">
            {offer.baskets?.map((basket) => {
              return (
                <li key={'basket_sum_' + basket.id} className="">
                  <h3 className="font-semibold text-sm flex justify-between gap-3 items-center mb-1">
                    <span>Cesta {basket.title}</span>
                    <span className="font-normal">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(basket.price)}
                    </span>
                  </h3>
                  <ul className="flex flex-col text-xs">
                    {basket.items?.map((item) => {
                      const product = item.item as Product
                      if (typeof item === 'number') return null
                      return (
                        <li
                          key={'basket_sum_item_' + item.id}
                          className="flex gap-3 justify-between border-b last:border-none py-1"
                        >
                          <p>{product.title}</p>
                          <p>
                            {item.quantity} {typeof item.unit !== 'number' && item.unit.value}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
          <h3 className="uppercase text-[10px] text-muted-foreground mb-1">
            <span>Avulsos</span>
          </h3>
          <ul className="flex flex-col text-sm">
            {offer.singles?.map((item) => {
              const product = item.item as Product
              if (typeof item === 'number') return null
              return (
                <li
                  key={'basket_sum_item_' + item.id}
                  className="flex gap-3 justify-between border-b last:border-none py-1"
                >
                  <p className="">
                    <span className="font-semibold">{product.title}</span> ({item.quantity}{' '}
                    {typeof item.unit !== 'number' && item.unit.value})
                  </p>
                  <p className="">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.price)}
                  </p>
                </li>
              )
            })}
          </ul>
        </ScrollArea> */
}
