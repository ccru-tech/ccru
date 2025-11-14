import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export type HomeProps = {}

export default async function Home(props: HomeProps) {
  return (
    <div className="min-h-svh w-full flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <img
            src="https://static.wixstatic.com/media/84a241_22441e0523ec4146a0ff9ece3cd78cda~mv2.png/v1/fill/w_298,h_298,al_c,lg_1,q_85,enc_avif,quality_auto/84a241_22441e0523ec4146a0ff9ece3cd78cda~mv2.png"
            alt="Coletivo CRU"
            className="w-48 mx-auto"
          />
          <p className="text-muted-foreground">Coletivo de Consumo Rural e Urbano</p>
        </div>
        <div className="grid gap-3">
          <Link href="/ofertas/5">
            <Button className="cursor-pointer w-full">Conferir oferta</Button>
          </Link>
          <Link href="/sobre">
            <Button variant={'outline'} className="cursor-pointer w-full">
              O que é isso?{' '}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
