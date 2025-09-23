'use server'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Order } from '@/payload-types'

export const createOrder = async (order: Partial<Order>) => {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  try {
    const newOrder = await payload.create({ collection: 'orders', data: order as Order })
    return { success: true, order: newOrder }
  } catch (error) {
    console.error({ error })
    return { success: false }
  }
}
