import { Button } from '@/components/ui/button'
import { Eye, Home } from 'lucide-react'
import Link from 'next/link'

export type SobreProps = {}

export default async function Sobre(props: SobreProps) {
  return (
    <div className="container px-4 md:px-8 xl:px-12 max-w-prose mx-auto py-8 prose">
      <h1>O que é isto?</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, quod. Beatae quibusdam
        similique nisi deserunt labore. Laboriosam molestias officiis animi porro minus possimus
        officia, ducimus iure esse cupiditate illo doloremque.
      </p>
      <div className="grid md:flex gap-3">
        <Link href="/ofertas/5">
          <Button className="cursor-pointer">
            <Eye />
            Conferir oferta
          </Button>
        </Link>
        <Link href="/">
          <Button variant={'outline'} className="cursor-pointer">
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  )
}
