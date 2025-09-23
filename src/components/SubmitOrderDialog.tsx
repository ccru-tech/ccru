'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useOrdersStore, useTotalItems } from '@/lib/ordersStore'
import React from 'react'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ArrowRight, CheckCircle2Icon, TriangleAlert } from 'lucide-react'
import { useMediaQuery } from 'usehooks-ts'
import { Input } from './ui/input'
import { find } from 'lodash'
import { createOrder } from '@/app/(frontend)/ofertas/[offerId]/functions'
import { redirect } from 'next/navigation'

export type SubmitOrderDialogProps = {}

export default function SubmitOrderDialog(props: SubmitOrderDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = React.useState(false)
  const { cart } = useOrdersStore()

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            key="xo"
            className="cursor-pointer w-full"
            disabled={cart.baskets.length === 0 && cart.singles.length === 0}
          >
            Fazer pedido <ArrowRight />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 gap-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Complete o seu pedido</DialogTitle>
          </DialogHeader>
          <SubmitOrderForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          key="zika"
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
        <SubmitOrderForm />
      </DrawerContent>
    </Drawer>
  )
}

const SubmitOrderForm = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [location, setLocation] = React.useState('')
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const { cart, offer } = useOrdersStore()
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const customer = { name, location, phone, cart }
    const distributionPoint = find(offer?.distribution_points, { id: parseInt(location) })
    const order = {
      offer: offer?.id,
      name,
      phone,
      distributionPoint:
        typeof distributionPoint === 'number' ? distributionPoint : distributionPoint?.id,
      singles: cart.singles.map((single) => ({ itemId: single.id, multiplier: single.multiplier })),
      baskets: cart.baskets.map((basket) => ({ itemId: basket.id, multiplier: basket.multiplier })),
    }
    const res = await createOrder(order)
    console.log(res)
    if (res.success && res.order)
      redirect(`/ofertas/${typeof offer === 'number' ? offer : offer!.id}/pedidos/${res.order.id}`)
  }
  return (
    <ScrollArea className="h-[calc(80svh-5rem)]">
      <form className="max-w-[calc(100vw)] md:w-full px-4 md:p-6" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex gap-2 mb-3">
          <div className="rounded-full size-6 shrink-0 flex items-center justify-center bg-primary text-primary-foreground border text-sm">
            1
          </div>
          <div>
            <h3 className="font-semibold">Confira o pedido.</h3>
            <p className="text-sm text-muted-foreground">
              Cheque os items no pedido, as quantidades e valores. Está tudo certo?
            </p>
          </div>
        </div>
        <div className="border rounded-md shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
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
                        <TableCell className=" w-2/5 md:w-1/3 whitespace-normal">
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
              <TableRow className="bg-muted">
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
        </div>
        <div className="flex gap-2 mb-3 mt-12">
          <div className="rounded-full size-6 shrink-0 flex items-center justify-center bg-primary text-primary-foreground border text-sm">
            2
          </div>
          <div>
            <h3 className="font-semibold">Qual o ponto de distribuição?</h3>
            <p className="text-sm text-muted-foreground">
              Selecione o núcleo do CCRU onde você vai retirar o pedido.
            </p>
          </div>
        </div>
        <RadioGroup
          value={location}
          onValueChange={(v) => setLocation(v)}
          className="grid grid-cols-2 gap-0"
          required
        >
          {offer?.distribution_points?.map((distribution_point) => {
            if (typeof distribution_point === 'number') return null
            return (
              <div
                key={'distributionP' + distribution_point.id}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={distribution_point.id.toString()}
                  id={distribution_point.id.toString()}
                />
                <Label
                  htmlFor={distribution_point.id.toString()}
                  className="py-3 w-full cursor-pointer hover:text-primary"
                >
                  {distribution_point.title}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
        <div className="flex gap-2 mb-3 mt-12">
          <div className="rounded-full size-6 shrink-0 flex items-center justify-center bg-primary text-primary-foreground border text-sm">
            3
          </div>
          <div>
            <h3 className="font-semibold">Adicione seus dados</h3>
            <p className="text-sm text-muted-foreground">
              Insira seu nome e telefone para a gente saber quem é você e poder entrar em contato
              para tratar do pedido.
            </p>
          </div>
        </div>
        <div className="grid gap-5">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Nome</Label>
            <Input
              type="text"
              name="firstName"
              autoComplete="name"
              placeholder="Nome"
              value={name}
              onChange={(v) => setName(v.target.value)}
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="email">Telefone com DDD</Label>
            <InputOTP
              maxLength={11}
              minLength={10}
              pattern={REGEXP_ONLY_DIGITS}
              required
              value={phone}
              onChange={(v) => setPhone(v)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="max-w-[8vw]" />
                <InputOTPSlot index={1} className="max-w-[8vw]" />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={2} className="max-w-[8vw]" />
                <InputOTPSlot index={3} className="max-w-[8vw]" />
                <InputOTPSlot index={4} className="max-w-[8vw]" />
                <InputOTPSlot index={5} className="max-w-[8vw]" />
                <InputOTPSlot index={6} className="max-w-[8vw]" />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={7} className="max-w-[8vw]" />
                <InputOTPSlot index={8} className="max-w-[8vw]" />
                <InputOTPSlot index={9} className="max-w-[8vw]" />
                <InputOTPSlot index={10} className="max-w-[8vw]" />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        <div className="flex gap-2 mb-3 mt-12">
          <div className="rounded-full size-6 shrink-0 flex items-center justify-center bg-primary text-primary-foreground border text-sm">
            3
          </div>
          <div>
            <h3 className="font-semibold">Confirme o pedido.</h3>
            <p className="text-sm text-muted-foreground">
              Clique no botão "Completar pedido" para registrar o seu pedido.
            </p>
          </div>
        </div>
        {isDesktop ? (
          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>

            <Button
              type="submit"
              className="w-full cursor-pointer shrink"
              disabled={location === '' || name === '' || phone.length < 10}
            >
              Completar pedido
            </Button>
          </DialogFooter>
        ) : (
          <DrawerFooter className="mt-4 px-0">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={location === '' || name === '' || phone.length < 10}
            >
              Completar pedido
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </form>
    </ScrollArea>
  )
}
