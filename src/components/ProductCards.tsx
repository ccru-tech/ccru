'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Offer, Product, Unit } from '@/payload-types'
import { useOrdersStore } from '@/lib/ordersStore'

import { findIndex } from 'lodash'
import { cn } from '@/lib/utils'

export type BasketCardProps = { basket: any /* Offer.baskets */ }

export function BasketCard({ basket }: BasketCardProps) {
  const { cart, setCart, addItem } = useOrdersStore()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cesta {basket.title}</CardTitle>
        <CardDescription>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(basket.price)}
        </CardDescription>
        <CardAction>
          <Button
            className={cn(
              'cursor-pointer',
              cart.baskets.filter((i) => i.id === basket.id).length > 0 && 'opacity-70',
            )}
            onClick={() => addItem(basket, 'baskets')}
          >
            <Plus /> Adicionar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {basket.items?.map((it: any) => {
              const item = it.item as Product
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-right">
                    {it.quantity} {(it.unit as Unit).value}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <ul className="text-sm grid gap-1 text-red-500"></ul>
      </CardContent>
    </Card>
  )
}

export type SinglesCardProps = { offer: Offer }

export function SinglesCard({ offer }: SinglesCardProps) {
  const { cart, addItem } = useOrdersStore()

  return (
    <Card className="w-full">
      <CardContent>
        <Table>
          <TableBody>
            {offer.singles?.map((it) => {
              const item = it.item as Product
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium w-1/2 md:w-1/3 whitespace-normal">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    {it.quantity}
                    {(it.unit as Unit).value}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(it.price)}
                  </TableCell>
                  <TableCell className="text-right w-0">
                    <Button
                      size={'sm'}
                      onClick={() => addItem(it, 'singles')}
                      className={cn(
                        'cursor-pointer',
                        cart.singles.filter((i) => i.id === it.id).length > 0 && 'opacity-70',
                      )}
                    >
                      <Plus />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <ul className="text-sm grid gap-1 text-red-500"></ul>
      </CardContent>
    </Card>
  )
}
