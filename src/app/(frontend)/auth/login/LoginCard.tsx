'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { loginAction } from '../server-functions'

const userFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default function LoginCard() {
  const [disabled, setDisabled] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: 'foo@bar.com',
      password: 'admin123',
    },
  })
  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    setDisabled(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const res = await loginAction(values)
    if (res.success) {
      router.push('/painel')
    } else {
      toast.error(res.message)
      setDisabled(false)
    }
  }
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Acesse</CardTitle>
        <CardDescription>Coloque seu email e uma senha para acessar sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className={cn('w-full', disabled ? 'animate-pulse' : '')}
                  disabled={disabled}
                >
                  Entrar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
