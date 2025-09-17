import { NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'

export async function GET() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const { docs } = await payload.find({ collection: 'offers', limit: 1, sort: '-distributionDate' })
  return NextResponse.json({ docs })
}
