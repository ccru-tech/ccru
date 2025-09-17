import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'

import { AppSidebar } from '@/components/app-sidebar'
import { BasketCard, SinglesCard } from '@/components/ProductCards'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const { docs } = await payload.find({ collection: 'offers', sort: '-distributionDate' })
  const offer = docs[0]
  const distributionDate = new Date(offer.distributionDate)
  const ordersMaxDate = new Date(offer.ordersMaxDate)
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '24rem',
          '--sidebar-width-mobile': 'calc(100svw-4rem)',
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <main className="min-h-svh w-full">
          <RefreshRouteOnSave />
          <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-8">
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
  )
}
