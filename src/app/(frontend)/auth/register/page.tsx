import config from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import RegisterCard from './RegisterCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export type LoginPageProps = {}

export default async function LoginPage(props: LoginPageProps) {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const url = headers.get('referer')
  const { user } = await payload.auth({ headers })
  if (user) redirect('/painel')
  return <RegisterCard />
}
