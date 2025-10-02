import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'
import SingleOrder from '@/components/SingleOrder'

export default async function Pedido({
  params,
}: {
  params: Promise<{ offerId: string; id: string }>
}) {
  const { id, offerId } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const order = await payload.findByID({ collection: 'orders', id, disableErrors: true, depth: 0 })
  const offer = await payload.findByID({ collection: 'offers', id: offerId })
  const distributionPoints = await payload.find({
    collection: 'distributionPoints',
    pagination: false,
  })

  const frete = 5
  if (!order)
    return (
      <div className="w-full h-svh flex items-center justify-center">Pedido não encontrado.</div>
    )
  return (
    <div className="w-full min-h-svh flex items-center justify-center p-4">
      <div className=" w-full max-w-lg grid gap-5">
        <img
          src="https://static.wixstatic.com/media/84a241_22441e0523ec4146a0ff9ece3cd78cda~mv2.png/v1/fill/w_298,h_298,al_c,lg_1,q_85,enc_avif,quality_auto/84a241_22441e0523ec4146a0ff9ece3cd78cda~mv2.png"
          alt="Coletivo CRU"
          className="w-24"
        />
        <SingleOrder order={order} offer={offer} distributionPoints={distributionPoints.docs} />
      </div>
    </div>
  )
}
