'use client'

import { DatePicker } from '@/components/painel/OfferDates'

export type pageProps = {}

export default function page(props: pageProps) {
  return (
    <div className="max-w-sm mx-auto p-4 py-8">
      <DatePicker />
    </div>
  )
}
