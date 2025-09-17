import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { RefreshRouteOnSave } from '../../RefreshRouteOnSave'

import { AppSidebar } from '@/components/app-sidebar'
import { BasketCard, SinglesCard } from '@/components/ProductCards'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export default async function OfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId: id } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const offer = await payload.findByID({ collection: 'offers', id, disableErrors: true })

  if (!offer)
    return (
      <div className="w-full h-svh flex items-center justify-center">Oferta não encontrada.</div>
    )
  const now = new Date()
  const distributionDate = new Date(offer.distributionDate)
  const ordersMaxDate = new Date(offer.ordersMaxDate)
  return (
    <>
      {now > distributionDate && (
        <div className="fixed w-svw h-svh bg-black/90 top-0 left-0 z-50 flex items-center justify-center text-lg text-white">
          Oferta já encerrada.
        </div>
      )}
      <SidebarProvider
        style={
          {
            '--sidebar-width': '24rem',
            '--sidebar-width-mobile': 'calc(100svw-4rem)',
          } as React.CSSProperties
        }
      >
        <SidebarInset>
          <main
            className={cn(
              'min-h-svh w-full',
              now > distributionDate && 'max-h-svh overflow-hidden pointer-events-none',
            )}
          >
            <RefreshRouteOnSave />
            <div className="container mx-auto px-4 py-8">
              <SidebarTrigger />
              <h1 className="font-black text-3xl md:text-5xl mb-4">CCRU Vila Prudente</h1>
              <div className="flex gap-8 mb-8 justify-between">
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
              </div>
              <h2 className="text-xl font-bold mb-4">Cestas</h2>
              <div className="grid gap-4 lg:flex mb-8">
                {offer.baskets?.map((basket) => {
                  return <BasketCard key={basket.id} basket={basket} />
                })}
              </div>
              <h2 className="text-xl font-bold mb-4">Avulsos</h2>
              <SinglesCard offer={offer} />
            </div>
          </main>
        </SidebarInset>
        <AppSidebar side="right" />
      </SidebarProvider>
    </>
  )
}
