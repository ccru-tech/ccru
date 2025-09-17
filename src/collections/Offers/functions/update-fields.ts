'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { Product } from '@/payload-types'

export async function updateFields(props: any) {
  const payload = await getPayload({ config })
  console.log(props.siblingData.item)
  const itemId = props.siblingData.item
  const unitId = props.siblingData.unit
  const quantity = props.siblingData.defaultQuantity
  let newData: Partial<Product> = { defaultQuantity: quantity, defaultUnit: unitId }

  const price = props.siblingData.price
  if (!isNaN(price) && price > 0) {
    newData.defaultPrice = price
  }
  try {
    await payload.update({
      collection: 'products',
      id: itemId, // the document id is required
      data: newData,
    })
    //return product
  } catch (error: any) {
    throw new Error(`Error updating post: ${error.message}`)
  }
}
