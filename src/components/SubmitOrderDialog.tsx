'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { useOrdersStore, useTotalItems } from '@/lib/ordersStore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'

import Link from 'next/link'
import { useMediaQuery } from 'usehooks-ts'
import { ArrowRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Viewport } from '@radix-ui/react-scroll-area'

export type SubmitOrderDialogProps = {}

export default function SubmitOrderDialog(props: SubmitOrderDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [location, setLocation] = React.useState('')
  const isDesktop = useMediaQuery('(min-width: 768px)')
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
  const Content = () => (
    <div className="max-w-[calc(100vw-2rem)]">
      <h3 className="flex gap-2 items-center font-semibold pb-3">
        <div className="rounded-full w-6 h-6 shrink-0 flex items-center justify-center bg-primary text-primary-foreground border text-sm">
          1
        </div>{' '}
        Confira se está tudo certo.
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Qtd</TableHead>
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
                    <TableCell className="max-w-16 whitespace-normal">
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
      <h3 className="flex gap-2 items-center font-semibold pb-3 mt-8">
        <div className="rounded-full w-6 h-6 shrink-0 flex items-center justify-center bg-primary text-primary-foreground border text-sm mb-2">
          2
        </div>{' '}
        Selecione o ponto de distribuição.
      </h3>
      <RadioGroup
        value={location}
        onValueChange={(v) => setLocation(v)}
        className="grid grid-cols-2 gap-5"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vila-prudente" id="vila-prudente" />
          <Label htmlFor="vila-prudente">Vila Prudente</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="santo-andre" id="santo-andre" />
          <Label htmlFor="santo-andre">Santo André</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sao-bernardo" id="sao-bernardo" />
          <Label htmlFor="sao-bernardo">São Bernardo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="diadema" id="diadema" />
          <Label htmlFor="diadema">Diadema</Label>
        </div>
      </RadioGroup>
      <h3 className="flex gap-2 items-center font-semibold pb-3 mt-8">
        <div className="rounded-full w-6 h-6 shrink-0 flex items-center justify-center bg-primary text-primary-foreground border text-sm">
          3
        </div>{' '}
        Clique no botão abaixo para completar o pedido.
      </h3>
      <p className="text-sm">
        Você será encaminhado para o aplicativo do Whatsapp com uma mensagem pré-escrita contendo o
        comprovante do seu pedido. Encaminhe essa mensagem para o seu grupo de compras.
      </p>
    </div>
  )
  const SubmitButton = () => (
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
      className={cn('w-full', location === '' && 'pointer-events-none')}
    >
      <Button className="w-full cursor-pointer" disabled={location === ''}>
        Completar pedido
      </Button>
    </a>
  )
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer w-full"
            disabled={cart.baskets.length === 0 && cart.singles.length === 0}
          >
            Fazer pedido <ArrowRight />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete o seu pedido</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Content />
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="cursor-pointer w-full"
          disabled={cart.baskets.length === 0 && cart.singles.length === 0}
        >
          Fazer pedido <ArrowRight />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="">
        <DrawerHeader className="text-left">
          <DrawerTitle>Complete o seu pedido</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[calc(80svh)] w-[calc(100vw)] px-4">
          <Content />
          <DrawerFooter className="mt-4 px-0">
            <SubmitButton />
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
