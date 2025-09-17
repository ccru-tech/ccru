import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'

export default async function Pedido({
  params,
}: {
  params: Promise<{ offerId: string; id: string }>
}) {
  const { id } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  // const order = await payload.findByID({ collection: 'orders', id, disableErrors: true })

  // if (!order)
  //   return (
  //     <div className="w-full h-svh flex items-center justify-center">Pedido não encontrado.</div>
  //   )
  return <div></div>
}
