'use client'

import { Offer } from '@/payload-types'
import { SidebarTrigger } from './ui/sidebar'
import { BasketCard, SinglesCard } from './ProductCards'
import { useEffect, useState } from 'react'
import { useOrdersStore } from '@/lib/ordersStore'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Card, CardContent } from './ui/card'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export type OfferMainProps = { offer: Offer }

export default function OfferMain({ offer }: OfferMainProps) {
  const [alert, setAlert] = useState(true)
  const { setOffer } = useOrdersStore()
  useEffect(() => {
    if (offer) setOffer(offer)
  }, [offer])

  const now = new Date()
  const distributionDate = new Date(offer.distributionDate)
  const ordersMaxDate = new Date(offer.ordersMaxDate)
  return (
    <>
      <AlertDialog open={alert} onOpenChange={() => setAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Este aplicativo está em fase de testes.</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="mb-2 block">
                <strong>Esta oferta, com data de entrega para o sábado 29/11, está ativa!</strong>.
                É o primeiro teste da nossa plataforma, válido somente para o grupo da Vila
                Prudente. Não se esqueça de enviar a mensagem no Whatsapp no fim do processo para
                confirmar a compra.
              </span>
              <span>Em caso de dúvidas e sugestões use o grupo do CCRU Vila Prudente.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="cursor-pointer!">Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="container mx-auto px-4 pt-4 bg-muted">
        <SidebarTrigger />
        <div className="grid  mb-8">
          <Link href="/" className="w-16 sm:w-24 block">
            <img src="/logo.avif" alt="Coletivo CRU" className="w-full" />
          </Link>
          <div className="w-full">
            <h1 className="font-bold text-2xl mb-2">Compra coletiva</h1>
            <Card className="p-0">
              <CardContent className="flex gap-8 justify-between p-3 md:p-4">
                <div className="grid gap-0">
                  <p className="font-bold text-muted-foreground">Data de distribuição</p>
                  <p className="font-medium text-lg">
                    {distributionDate.toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="grid gap-0">
                  <p className="font-bold text-sm text-muted-foreground">Pedidos até</p>
                  <p className="">{ordersMaxDate.toLocaleDateString('pt-BR')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <h2 className="text-lg font-bold mb-2">Cestas</h2>
        <div
          className={cn(
            'grid gap-4 lg:grid-cols-2 xl:grid-cols-3 mb-8',
            now > distributionDate && 'pointer-events-none',
          )}
        >
          {offer.baskets?.map((basket) => {
            return <BasketCard key={basket.id} basket={basket} />
          })}
        </div>
        <h2 className="text-lg font-bold mb-2">Avulsos</h2>
        <SinglesCard offer={offer} />
      </div>
    </>
  )
}
