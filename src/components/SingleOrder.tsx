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
import { processOrderArray } from '@/lib/utils'
import { DistributionPoint, Offer, Order } from '@/payload-types'
import { find, sum } from 'lodash'
import { AlertCircle, ArrowRight, Clipboard, MessageCircle, PhoneCall } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { useCopyToClipboard } from 'usehooks-ts'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'
import Link from 'next/link'

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
          <div className="grid  group p-2 border-b">
            <div className="flex gap-3 justify-between ">
              <div className="flex items-center gap-2">
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
            <p className="font-normal text-xl">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(
                sum(orderedItems(order).baskets.map((basket) => basket.price * basket.multiplier)) +
                  sum(
                    orderedItems(order).singles.map((single) => single.price * single.multiplier),
                  ) +
                  frete,
              )}
            </p>
          </div>
          <div className="p-2">
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
          </div>
        </CardContent>
      </Card>

      <h2 className="font-bold text-xl flex gap-3 items-center">
        <AlertCircle />
        Envie o comprovante do pedido no Whatsapp
      </h2>
      <p>
        Para validar o seu pedido, pedimos que envie essa mensagem para o seu grupo de compras do
        CCRU no Whatsapp.
      </p>
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
      <a target="_blank" href={whatsappUrl}>
        <Button className="w-full cursor-pointer">
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
      <h2 className="font-bold text-xl text-center">Muito obrigado pelo seu pedido!</h2>
      <Link href={`/ofertas/${offer.id}/pedidos`}>
        <Button variant={'link'} className="w-full cursor-pointer">
          Ver o painel da compra <ArrowRight />
        </Button>
      </Link>
    </>
  )
}
