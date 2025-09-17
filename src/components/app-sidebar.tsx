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
import { useOrdersStore, useTotalItems } from '@/lib/ordersStore'
import { Button } from './ui/button'
import { Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import SubmitOrderDialog from './SubmitOrderDialog'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { cart, removeItem, addItem } = useOrdersStore()

  const totalItems = useTotalItems()
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
      <SidebarContent className="pt-12">
        {['baskets', 'singles'].map((type) => {
          const collection = cart[type as 'baskets' | 'singles']
          if (collection.length === 0) return null
          return (
            <SidebarGroup key={`sidebar_${type}`}>
              <SidebarGroupLabel className="text-xs uppercase tracking-wide">
                {type === 'baskets' ? 'Cestas' : 'Avulsos'}
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-2">
                <ul className="flex flex-col gap-3">
                  {collection.map((item: any) => {
                    return (
                      <li key={type + item.id} className="flex gap-3 justify-between items-center">
                        <Button
                          size="icon"
                          className="w-8 h-12 rounded-xs cursor-pointer shrink-0 bg-red-600/30 text-black hover:text-white"
                          variant={'destructive'}
                          onClick={() => removeItem(item.id, type as 'singles' | 'baskets')}
                        >
                          <Minus className="size-4" />
                        </Button>
                        <div className="grid grid-cols-3 gap-3 justify-between w-full border-b">
                          <div className="col-span-2">
                            <span className="font-semibold">{item.multiplier}x</span> {item.title}
                          </div>
                          <div className="col-span-1 text-xs text-muted-foreground">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item.price)}
                          </div>
                        </div>
                        <Button
                          size="icon"
                          className="w-8 h-12 rounded-xs cursor-pointer shrink-0 bg-lime-600/30 text-black hover:text-white"
                          variant={'default'}
                          onClick={() => addItem(item, type as 'singles' | 'baskets')}
                        >
                          <Plus className="size-4" />
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}

        {cart.baskets.length === 0 && cart.singles.length === 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Faça o seu pedido</SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <p>Você ainda não adicionou items ao carrinho.</p>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide">
            Total ({totalItems} {totalItems > 1 ? 'itens' : 'item'})
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2 flex flex-col gap-3">
            <p className="text-xl">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </p>
            <SubmitOrderDialog />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
