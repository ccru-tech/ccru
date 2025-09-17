'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { useOrdersStore, useTotalItems } from '@/lib/ordersStore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import React from 'react'
import Link from 'next/link'

export type SubmitOrderDialogProps = {}

export default function SubmitOrderDialog(props: SubmitOrderDialogProps) {
  const { cart } = useOrdersStore()
  const totalItems = useTotalItems()
  const total = React.useMemo(() => {
    let result = 0
    cart.baskets.forEach((basket) => {
      result += basket.price * basket.multiplier
    })
    cart.singles.forEach((basket) => {
      result += basket.price * basket.multiplier
    })
    return result
  }, [cart])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer w-full"
          disabled={cart.baskets.length === 0 && cart.singles.length === 0}
        >
          Fazer pedido
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete o seu pedido</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="">
          <h3 className="flex gap-2 items-center font-semibold pb-3">
            <div className="rounded-full w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground border text-sm">
              1
            </div>{' '}
            Confira se está tudo certo.
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Valor por unid.</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {['baskets', 'singles'].map((type) => {
                const collection = cart[type as 'baskets' | 'singles']
                if (collection.length === 0) return null
                return (
                  <React.Fragment key={`reviewOrder_${type}`}>
                    {collection.map((item) => (
                      <TableRow key={`reviewOrderRow${item.id}`}>
                        <TableCell>
                          {type === 'baskets' && 'Cesta '}
                          {item.title}
                        </TableCell>
                        <TableCell className="text-right">{item.multiplier}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.price * item.multiplier)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                )
              })}
              <TableRow>
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-right">{totalItems} items</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <hr />
          <h3 className="flex gap-2 items-center font-semibold pb-3 mt-5">
            <div className="rounded-full w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground border text-sm">
              2
            </div>{' '}
            Clique no botão abaixo para completar o pedido.
          </h3>
          <p className="text-sm mb-6">
            Você será encaminhado para o aplicativo do Whatsapp com uma mensagem pré-escrita
            contendo o comprovante do seu pedido. Encaminhe essa mensagem para o seu grupo de
            compras.
          </p>
          <a
            href={`https://api.whatsapp.com/send/?text=${encodeURIComponent(
              `Segue o meu pedido:\n${['baskets', 'singles']
                .map((type) => {
                  const collection = cart[type as 'baskets' | 'singles']
                  if (collection.length === 0) return null
                  return `\n${type === 'baskets' ? 'Cestas' : 'Avulsos'}:\n${collection.map((item) => `- ${item.title} x ${item.multiplier}\n`).join('')}`
                })
                .join('')}`,
            )}\n\nLink do pedido: https://ccru-one.vercel.app/[ID_DA_OFERTA]/[ID_DO_PEDIDO]`}
            target="_blank"
          >
            <Button className="w-full cursor-pointer">Completar pedido</Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
