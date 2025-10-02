'use server'

import { getPayload } from 'payload'

import config from '@/payload.config'
import { Order } from '@/payload-types'

export const createOrder = async (order: Partial<Order>) => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  try {
    const orderExists = await payload.find({
      collection: 'orders',
      where: { phone: { equals: order.phone }, offer: { equals: order.offer } },
      limit: 1,
    })
    if (orderExists.docs?.length > 0) {
      return { success: false, error: 'userHasOrdered', id: orderExists.docs[0].id }
    }
    const newOrder = await payload.create({ collection: 'orders', data: order as Order })
    return { success: true, order: newOrder }
  } catch (error) {
    console.error({ error })
    return { success: false, error: 'unknown' }
  }
}

export const deleteOrder = async (orderId: number) => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  try {
    await payload.delete({ collection: 'orders', id: orderId })
    return { success: true }
  } catch (error) {
    console.error({ error })
    return { success: false, error: 'unknown' }
  }
}
