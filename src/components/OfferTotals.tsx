/*
    Aqui vem uma tabela com a quantidade de cestas e avulsos pedidos na oferta.

    Opção de filtrar por ponto de distribuição.
*/
'use client'

import { processOrderArray } from '@/lib/utils'
import { DistributionPoint, Offer, Order } from '@/payload-types'
import { find, sum } from 'lodash'
import { useMemo, useState } from 'react'
import { Card, CardContent } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { Badge } from './ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useOrdersStore } from '@/lib/ordersStore'

export type OfferTotalsProps = {
  offer: Offer
  orders: Order[]
  distributionPoints: DistributionPoint[]
}

export default function OfferTotals({ offer, orders, distributionPoints }: OfferTotalsProps) {
  const { distributionPoint, setDistributionPoint } = useOrdersStore()
  const selectedOrders = useMemo(() => {
    if (distributionPoint === 'Todos') return orders
    return orders.filter((order) => order.distributionPoint === distributionPoint)
  }, [distributionPoint, orders])
  const orderedItems: { baskets: any[]; singles: any[] } = useMemo(() => {
    if (!selectedOrders) return { baskets: [], singles: [] }
    return {
      baskets: processOrderArray(offer, selectedOrders, 'baskets'),
      singles: processOrderArray(offer, selectedOrders, 'singles'),
    }
  }, [selectedOrders, offer])
  return (
    <Card className="p-0">
      <CardContent className="p-4">
        <div className="grid md:flex items-center gap-4 justify-between mb-3">
          <h2 className="text-lg md:text-xl font-bold">Resumo dos pedidos</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Ponto de distribuição:{' '}
                {distributionPoint === 'Todos'
                  ? distributionPoint
                  : find(distributionPoints, { id: distributionPoint })?.title}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Ponto de distribuição</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={distributionPoint?.toString()}
                onValueChange={(v) => setDistributionPoint(v)}
              >
                <DropdownMenuRadioItem value={'Todos'}>Todos</DropdownMenuRadioItem>
                {distributionPoints.map((point) => (
                  <DropdownMenuRadioItem
                    key={'selectTableTotals' + point.id}
                    value={point.id.toString()}
                    disabled={
                      orders.filter((order) => order.distributionPoint === point.id).length === 0
                    }
                  >
                    {point.title}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
            {orderedItems.baskets.map((basket) => {
              return (
                <TableRow key={'offertotalbasket' + basket.id}>
                  <TableCell>Cesta {basket.title}</TableCell>
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
            {orderedItems.singles.map((single) => {
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
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(
                  sum(orderedItems.baskets.map((basket) => basket.price * basket.multiplier)) +
                    sum(orderedItems.singles.map((single) => single.price * single.multiplier)),
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
