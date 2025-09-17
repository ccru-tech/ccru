'use client'
import React, { useEffect } from 'react'
import { NumberField, RelationshipField, TextField, useField, useWatchForm } from '@payloadcms/ui'
import type { NumberFieldClientComponent, RelationshipFieldClientComponent } from 'payload'

export const CustomNumberFieldQuantity: NumberFieldClientComponent = (props) => {
  const { field, path } = props
  const { value, setValue } = useField({ path })
  const { getDataByPath } = useWatchForm()
  const siblingValue = getDataByPath(path.replace('.quantity', '.item')) // Get value of sibling field

  useEffect(() => {
    if (!value && siblingValue) {
      try {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${siblingValue}`)
          .then((res) => res.json())
          .then((res) => {
            setValue(res.defaultQuantity)
          })
      } catch (error) {
        console.log('Failed to fetch.')
      }
    }
  }, [siblingValue, setValue]) // Re-run effect when siblingValue changes

  return <NumberField {...props} />
}
export const CustomNumberFieldPrice: NumberFieldClientComponent = (props) => {
  const { field, path } = props
  const { value, setValue } = useField({ path })
  const { getDataByPath } = useWatchForm()
  const siblingValue = getDataByPath(path.replace('.price', '.item')) // Get value of sibling field

  useEffect(() => {
    if (!value && siblingValue) {
      try {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${siblingValue}`)
          .then((res) => res.json())
          .then((res) => {
            setValue(res.defaultPrice)
          })
      } catch (error) {
        console.log('Failed to fetch.')
      }
    }
  }, [siblingValue, setValue]) // Re-run effect when siblingValue changes

  return <NumberField {...props} />
}
export const CustomRelationshipFieldUnit: RelationshipFieldClientComponent = (props) => {
  const { field, path } = props
  const { value, setValue } = useField({ path })
  const { getDataByPath } = useWatchForm()
  const siblingValue = getDataByPath(path.replace('.unit', '.item')) // Get value of sibling field

  useEffect(() => {
    if (!value && siblingValue) {
      try {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${siblingValue}`)
          .then((res) => res.json())
          .then((res) => {
            if (!!res.defaultUnit?.id) setValue(res.defaultUnit.id)
          })
      } catch (error) {
        console.log('Failed to fetch.')
      }
    }
  }, [siblingValue, setValue]) // Re-run effect when siblingValue changes

  return <RelationshipField {...props} />
}
