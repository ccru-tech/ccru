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
  const distributionDate = new Date(offer.distributionDate)
  return (
    <>
      <div className="flex justify-between mt-2 mb-3">
        <p className="text-sm font-semibold">Pedido #{order.id}</p>
        <p className="text-sm">Compra de {distributionDate.toLocaleDateString('pt-BR')}</p>
      </div>
      <Card className="p-0 mb-8">
        <CardContent className="p-4">
          <div className="">
            <p className="font-semibold text-lg mb-3 border-b pb-2">
              {order.name}{' '}
              {/* <span className="text-muted-foreground text-sm pl-3 font-normal">
                {order.phone.slice(0, 2)} {order.phone.slice(2, -1)}
              </span> */}
            </p>
          </div>
          <div className={cn('flex justify-between items-end  group')}>
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
      <p className="mb-5">
        Para finalizar o seu pedido, pedimos que envie essa mensagem para o seu grupo de compras do
        CCRU no Whatsapp.
      </p>
      <a target="_blank" href={whatsappUrl}>
        <Button variant={'secondary'} className="w-full cursor-pointer mb-5">
          <MessageCircle className="fill-white text-transparent" /> Enviar mensagem no Whatsapp
        </Button>
      </a>
      <Alert className="mb-5">
        <TriangleAlert />
        <AlertDescription>
          <p className="text-xs">
            Ao clicar no botão acima você será encaminhado/a para o aplicativo do Whatsapp com uma
            mensagem pré-escrita contendo o comprovante do seu pedido. Se preferir, copie e cole a
            mensagem.
          </p>
        </AlertDescription>
      </Alert>
      <div className="relative mb-5">
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
      <Link href={`/ofertas/${offer.id}/pedidos`}>
        <Button variant={'link'} className="cursor-pointer">
          Ver o painel da compra <ArrowRight />
        </Button>
      </Link>
    </>
  )
}
