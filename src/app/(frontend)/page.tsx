import { redirect } from 'next/navigation'

export type pageProps = {}

export default async function page(props: pageProps) {
  redirect('/ofertas/5')
}
