'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useOrdersStore } from '@/lib/ordersStore'
import { Button } from './ui/button'
import { Minus, Plus } from 'lucide-react'
import Link from 'next/link'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { cart, removeItem, addSingle, addBasket } = useOrdersStore()
  const total = React.useMemo(() => {
    let result = 0
    cart.baskets.forEach((basket) => {
      result += basket.price * basket.multiplier
    })
    cart.singles.forEach((basket) => {
      result += basket.price * basket.multiplier
    })
    return result
  }, [cart])
  return (
    <Sidebar {...props}>
      <SidebarContent>
        {cart.baskets.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Cestas</SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <ul className="flex flex-col gap-3">
                {cart.baskets.map((basket) => {
                  return (
                    <li
                      key={'basket_' + basket.id}
                      className="flex gap-3 justify-between items-center"
                    >
                      <Button
                        size="icon"
                        className="size-6 rounded-full cursor-pointer shrink-0 bg-red-600/30 text-black hover:text-white"
                        variant={'destructive'}
                        onClick={() => removeItem(basket.id, 'baskets')}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <div className="grid grid-cols-3 gap-3 justify-between w-full border-b">
                        <div className="col-span-2">
                          <span className="font-semibold">{basket.multiplier}x</span> {basket.title}
                        </div>
                        <div className="col-span-1 text-xs text-muted-foreground">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(basket.price)}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        className="size-6 rounded-full cursor-pointer shrink-0 bg-lime-600/30 text-black hover:text-white"
                        variant={'default'}
                        onClick={() => addBasket(basket)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {cart.singles.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Avulsos</SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <ul className="flex flex-col gap-3">
                {cart.singles.map((single) => {
                  return (
                    <li
                      key={'basket_' + single.id}
                      className="flex gap-3 justify-between items-center"
                    >
                      <Button
                        size="icon"
                        className="size-6 rounded-full cursor-pointer shrink-0 bg-red-600/30 text-black hover:text-white"
                        variant={'destructive'}
                        onClick={() => removeItem(single.id, 'singles')}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <div className="grid grid-cols-3 gap-3 justify-between w-full border-b">
                        <div className="col-span-2">
                          <span className="font-semibold">{single.multiplier}x</span>{' '}
                          {single.item.title}
                        </div>
                        <div className="col-span-1 text-xs text-muted-foreground">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(single.price)}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        className="size-6 rounded-full cursor-pointer shrink-0 bg-lime-600/30 text-black hover:text-white"
                        variant={'default'}
                        onClick={() => addSingle(single)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {cart.baskets.length === 0 && cart.singles.length === 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Faça o seu pedido</SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <p>Você ainda não adicionou items ao carrinho.</p>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Total</SidebarGroupLabel>
          <SidebarGroupContent className="px-2 flex flex-col gap-3">
            <p>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </p>
            <Link href={`https://api.whatsapp.com/send/?text=urlencodedtext.`}>
              <Button
                className="cursor-pointer w-full"
                disabled={cart.baskets.length === 0 && cart.singles.length === 0}
              >
                Fazer pedido
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
