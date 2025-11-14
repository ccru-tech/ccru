import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'
import OfferSummary from '@/components/OfferSummary'
import OfferTotals from '@/components/OfferTotals'
import OfferOrders from '@/components/OfferOrders'

export default async function PainelOferta({ params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const offer = await payload.findByID({ collection: 'offers', id: offerId })
  const distributionPoints = await payload.find({
    collection: 'distributionPoints',
    pagination: false,
  })
  const orders = await payload.find({
    collection: 'orders',
    disableErrors: true,
    depth: 0,
    where: { offer: { equals: offerId } },
    pagination: false,
  })
  const frete = 5

  if (!offer)
    return <div className="w-full h-svh flex items-center justify-center">Ocorreu um erro.</div>
  return (
    <main className="w-full p-4 md:px-8 xl:px-16 md:py-8 grid gap-4">
      <OfferSummary offer={offer} />
      <div className="flex flex-col lg:grid grid-cols-2 gap-4">
        <OfferTotals
          offer={offer}
          orders={orders.docs}
          distributionPoints={distributionPoints.docs}
        />
        <OfferOrders
          offer={offer}
          orders={orders.docs}
          distributionPoints={distributionPoints.docs}
          frete={frete}
        />
      </div>
      {/* <div>{JSON.stringify(offer)}</div>
      <div>{JSON.stringify(orders)}</div> */}
    </main>
  )
}
