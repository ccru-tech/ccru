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
    <Card className="p-0">
      <CardHeader className="p-3 md:p-4 !pb-0">
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
      <CardContent className="p-3 md:p-4 !pt-0">
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
      </CardContent>
    </Card>
  )
}

export type SinglesCardProps = { offer: Offer }

export function SinglesCard({ offer }: SinglesCardProps) {
  const { cart, addItem } = useOrdersStore()

  return (
    <Card className="w-full p-0">
      <CardContent className="p-3 md:p-4">
        <Table>
          <TableBody>
            {offer.singles?.map((it) => {
              const item = it.item as Product
              return (
                <TableRow key={item.id} className="odd:bg-primary/10 hover:bg-primary/20">
                  <TableCell className="font-medium w-1/2  lg:w-max whitespace-normal ">
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
                      className={cn('cursor-pointer')}
                    >
                      <Plus />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
