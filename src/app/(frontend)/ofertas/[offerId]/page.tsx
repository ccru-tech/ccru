import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { RefreshRouteOnSave } from '../../RefreshRouteOnSave'

import { CartSidebar } from '@/components/CartSidebar'
import { BasketCard, SinglesCard } from '@/components/ProductCards'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import OfferMain from '@/components/OfferMain'

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
  const canEdit = Boolean(user) || now < distributionDate
  return (
    <>
      <SidebarProvider
        style={
          {
            '--sidebar-width': '24rem',
            '--sidebar-width-mobile': 'calc(100svw-3rem)',
          } as React.CSSProperties
        }
      >
        <SidebarInset>
          <main className={cn('min-h-svh w-full')}>
            <RefreshRouteOnSave />
            <OfferMain offer={offer} canEdit={canEdit} />
          </main>
        </SidebarInset>
        <CartSidebar side="right" canEdit={canEdit} />
      </SidebarProvider>
    </>
  )
}
