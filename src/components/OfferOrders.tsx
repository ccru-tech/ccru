'use client'

import { useOrdersStore } from '@/lib/ordersStore'
import { processOrderArray } from '@/lib/utils'
import { Offer, Order, DistributionPoint } from '@/payload-types'
import { useCallback, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { find, sum } from 'lodash'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { PhoneCall } from 'lucide-react'

export type OfferOrdersProps = {
  offer: Offer
  orders: Order[]
  distributionPoints: DistributionPoint[]
  frete: number
}

export default function OfferOrders({
  orders,
  offer,
  distributionPoints,
  frete,
}: OfferOrdersProps) {
  const { distributionPoint, setDistributionPoint } = useOrdersStore()
  const selectedOrders = useMemo(() => {
    if (distributionPoint === 'Todos') return orders
    return orders.filter((order) => order.distributionPoint === distributionPoint)
  }, [distributionPoint, orders])
  const orderedItems: (ord: Order) => { baskets: any[]; singles: any[] } = useCallback(
    (ord) => {
      if (!ord) return { baskets: [], singles: [] }
      return {
        baskets: processOrderArray(offer, [ord], 'baskets'),
        singles: processOrderArray(offer, [ord], 'singles'),
      }
    },
    [selectedOrders, offer],
  )
  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <div className="h-14 p-4 border-b">
          <h2 className="font-bold text-lg md:text-xl mb-3">Pedidos</h2>
        </div>
        <ScrollArea className="p-2 w-full lg:h-[calc(100svh-14rem-2px)]">
          <div className="grid gap-3 ">
            {selectedOrders.map((order) => {
              return (
                <Collapsible key={'order_offer_' + order.id} className="border rounded-md">
                  <CollapsibleTrigger asChild>
                    <div className="grid cursor-pointer group p-2 border-b">
                      <div className="flex gap-3 justify-between ">
                        <div className="flex items-center gap-2 group-hover:text-primary">
                          <Badge variant={'outline'} className="h-8 w-20 text-sm">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(
                              sum(
                                orderedItems(order).baskets.map(
                                  (basket) => basket.price * basket.multiplier,
                                ),
                              ) +
                                sum(
                                  orderedItems(order).singles.map(
                                    (single) => single.price * single.multiplier,
                                  ),
                                ) +
                                frete,
                            )}
                          </Badge>
                          <p className="font-semibold">{order.name} </p>
                          <p className="flex gap-2 items-center font-light text-muted-foreground text-xs">
                            <PhoneCall className="size-3" />
                            {order.phone.slice(0, 2)} {order.phone.slice(2, -1)}
                          </p>
                        </div>
                        <Badge>
                          {typeof order.distributionPoint === 'string' ||
                          typeof order.distributionPoint === 'number'
                            ? find(distributionPoints, { id: order.distributionPoint })?.title
                            : order.distributionPoint.title}
                        </Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Qtd</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderedItems(order).baskets.map((basket) => {
                          return (
                            <TableRow key={'offertotalbasket' + basket.id}>
                              <TableCell className="whitespace-break-spaces w-1/3 sm:w-auto">
                                Cesta {basket.title}
                              </TableCell>
                              <TableCell>
                                <Badge variant={'outline'}>Cesta</Badge>
                              </TableCell>
                              <TableCell className="text-right">{basket.multiplier}</TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(basket.price * basket.multiplier)}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                        {orderedItems(order).singles.map((single) => {
                          return (
                            <TableRow key={'offertotalsingle' + single.id}>
                              <TableCell className="whitespace-break-spaces w-1/3 sm:w-auto">
                                {single.item.title}
                              </TableCell>
                              <TableCell>
                                <Badge variant={'outline'}>Avulso</Badge>
                              </TableCell>
                              <TableCell className="text-right">{single.multiplier}</TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(single.price)}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                      <TableFooter>
                        <TableRow className="text-muted-foreground ">
                          <TableCell colSpan={3}>Frete</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(5)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3}>Total</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(
                              sum(
                                orderedItems(order).baskets.map(
                                  (basket) => basket.price * basket.multiplier,
                                ),
                              ) +
                                sum(
                                  orderedItems(order).singles.map(
                                    (single) => single.price * single.multiplier,
                                  ),
                                ) +
                                frete,
                            )}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
