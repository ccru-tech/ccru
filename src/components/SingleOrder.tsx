'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useOrdersStore } from '@/lib/ordersStore'
import { cn, processOrderArray } from '@/lib/utils'
import { DistributionPoint, Offer, Order } from '@/payload-types'
import { find, sum } from 'lodash'
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clipboard,
  MessageCircle,
  PhoneCall,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

export type SingleOrderProps = {
  offer: Offer
  distributionPoints: DistributionPoint[]
  frete?: number
  order: Order
}

export default function SingleOrder({
  offer,
  distributionPoints,
  frete = 5,
  order,
}: SingleOrderProps) {
  const [showOrder, setShowOrder] = useState(false)
  const [copiedText, copy] = useCopyToClipboard()

  const { distributionPoint, setDistributionPoint } = useOrdersStore()

  const orderedItems: (ord: Order) => { baskets: any[]; singles: any[] } = useCallback(
    (ord) => {
      if (!ord) return { baskets: [], singles: [] }
      return {
        baskets: processOrderArray(offer, [ord], 'baskets'),
        singles: processOrderArray(offer, [ord], 'singles'),
      }
    },
    [order, offer],
  )
  const orderMessage = useMemo(
    () =>
      `Segue o meu pedido:\n${['baskets', 'singles']
        .map((type) => {
          const collection = orderedItems(order)[type as 'baskets' | 'singles'] || []
          if (collection.length === 0) return null
          return `\n${type === 'baskets' ? 'Cestas' : 'Avulsos'}:\n${collection.map((item: any) => `- ${item.title || item.item.title} x ${item.multiplier}\n`).join('')}`
        })
        .join(
          '',
        )}\nLink do pedido: https://ccru-one.vercel.app/ofertas/${offer.id}/pedidos/${order.id}`,
    [order, offer],
  )
  const whatsappUrl = useMemo(
    () => `https://api.whatsapp.com/send/?text=${encodeURIComponent(orderMessage)}`,
    [order, offer],
  )

  return (
    <>
      <Card className="p-0">
        <CardContent className="p-4">
          <div className={cn('flex justify-between items-end  group')}>
            {/* <div className="">
              <p className="font-semibold">{order.name} </p>
              <p className="text-muted-foreground text-sm mb-2">
                {order.phone.slice(0, 2)} {order.phone.slice(2, -1)}
              </p>
            </div> */}
            <div>
              <p className="text-xs uppercase tracking-widest">Ponto de distribuição</p>
              <p className="text-lg font-semibold">Vila Prudente</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest">Total</p>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(
                  sum(
                    orderedItems(order).baskets.map((basket) => basket.price * basket.multiplier),
                  ) +
                    sum(
                      orderedItems(order).singles.map((single) => single.price * single.multiplier),
                    ) +
                    frete,
                )}
              </p>
            </div>
          </div>
          <Button
            className="w-full my-3 cursor-pointer"
            onClick={() => setShowOrder((prev) => !prev)}
          >
            Detalhes do pedido {showOrder ? <ChevronUp /> : <ChevronDown />}
          </Button>
          <Collapsible open={showOrder} onOpenChange={setShowOrder}>
            <CollapsibleContent asChild>
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
        </CardContent>
      </Card>

      <h2 className="text-destructive font-bold text-base leading-tight md:text-lg xl:text-xl flex gap-3 items-center">
        <AlertCircle className="shrink-0 size-6" />
        Envie o comprovante do pedido no Whatsapp
      </h2>
      <p>
        Para finalizar o seu pedido, pedimos que envie essa mensagem para o seu grupo de compras do
        CCRU no Whatsapp.
      </p>
      <a target="_blank" href={whatsappUrl}>
        <Button variant={'secondary'} className="w-full cursor-pointer">
          <MessageCircle className="fill-white text-transparent" /> Enviar mensagem no Whatsapp
        </Button>
      </a>
      <Alert>
        <TriangleAlert />
        <AlertDescription>
          <p className="text-xs">
            Ao clicar no botão acima você será encaminhado/a para o aplicativo do Whatsapp com uma
            mensagem pré-escrita contendo o comprovante do seu pedido. Se preferir, copie e cole a
            mensagem.
          </p>
        </AlertDescription>
      </Alert>
      <div className="relative">
        <Button
          variant="outline"
          className="absolute top-2 right-2 z-10 cursor-pointer"
          onClick={() => {
            copy(orderMessage)
              .then(() => {
                toast('Mensagem copiada!')
              })
              .catch((error) => {
                console.error('Failed to copy!', error)
              })
          }}
        >
          <Clipboard />
        </Button>

        <Textarea defaultValue={orderMessage} />
      </div>
      <h2 className="font-bold text-lg md:text-xl text-center">Muito obrigado pelo seu pedido!</h2>
      <Link href={`/ofertas/${offer.id}/pedidos`}>
        <Button variant={'link'} className="w-full cursor-pointer">
          Ver o painel da compra <ArrowRight />
        </Button>
      </Link>
    </>
  )
}
