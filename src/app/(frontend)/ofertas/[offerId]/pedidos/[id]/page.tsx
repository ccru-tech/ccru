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
        <h2 className="font-bold text-xl">Muito obrigado, seu pedido foi registrado!</h2>
        <SingleOrder order={order} offer={offer} distributionPoints={distributionPoints.docs} />
      </div>
    </div>
  )
}
