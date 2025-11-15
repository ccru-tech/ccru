import { Button } from '@/components/ui/button'
import { Eye, Home } from 'lucide-react'
import Link from 'next/link'

export type SobreProps = {}

export default async function Sobre(props: SobreProps) {
  return (
    <div className="container px-4 md:px-8 xl:px-12 max-w-prose mx-auto py-8 prose">
      <h1>O que é isso?</h1>
      <p>
        Este site é uma plataforma que tem o objetivo de dinamizar a compra e oferta de alimentos
        agroecológicos do CCRU. A cada quinzena é disponibilizada aqui uma oferta de alimentos
        avulsos e organizados em cestas. A plataforma serve para exibir e organizar essa oferta,
        permitindo que as pessoas montem e enviem seus pedidos.
      </p>
      <p>
        Por enquanto, a plataforma se encontra em fase de testes e, enquanto isso, será usada para a
        gestão das compras do núcleo da Vila Prudente junto com o grupo de Whatsapp. Espera-se que
        em breve a plataforma possa servir para os demais núcleos de Diadema, Santo André, São
        Bernardo do Campo e, quem sabe, também para outras iniciativas de consumo popular.
      </p>
      <h2>O CCRU</h2>
      <p>
        O Coletivo de Consumo Rural Urbano é uma iniciativa que visa o fortalecimento, ampliação e
        consolidação do abastecimento popular de alimentos agroecológicos com atuação centrada no
        Estado de São Paulo com especial ênfase no ABCD.
      </p>
      <p>
        Para mais informações, confira{' '}
        <Link href={'https://ccrusolo.wixsite.com/ccrusolo'} target="_blank">
          o site (https://ccrusolo.wixsite.com/ccrusolo)
        </Link>{' '}
        e{' '}
        <Link href={'https://ccrusolo.wixsite.com/ccrusolo'} target="_blank">
          o Instagram (https://www.instagram.com/ccrusolo/)
        </Link>{' '}
        do coletivo.
      </p>
      <hr />
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
      <p className="text-sm text-muted-foreground">Última atualização em 15 de novembro de 2025</p>
    </div>
  )
}
