'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, AlertTriangle, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { registerFormSchema } from '../authConfig';
import { loginAction, registerUser } from '../server-functions';
import Link from 'next/link';

export default function RegisterCard() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: 'Foo',
      last_name: 'Bar',
      email: 'foo@bar.com',
      password: 'admin123',
      confirmPassword: 'admin123'
    }
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { email, password } = values;
    const registerRes = await registerUser(values);
    if (registerRes.success) {
      toast.success(registerRes.message);
      await loginAction({ email, password });
      setTimeout(() => {
        router.push('/app');
      }, 500);
    } else {
      toast.error(registerRes.message);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Crie sua conta</CardTitle>
        <CardDescription>
          <Link
            href="/auth/login"
            className="font-medium hover:underline flex gap-2 items-center"
          >
            <AlertCircle className="text-primary size-4" />
            Caso já tenha conta, faça login aqui.
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                            required
                          />
                          <ShowPasswordButton
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                            required
                          />
                          <ShowPasswordButton
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const ShowPasswordButton = ({
  showPassword,
  setShowPassword
}: {
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-1 top-1 h-7 w-7  opacity-50  hover:opacity-100"
      onClick={() => setShowPassword((prev) => !prev)}
    >
      {showPassword ? (
        <EyeIcon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">
        {showPassword ? 'Exibir senha' : 'Esconder senha'}
      </span>
    </Button>
  );
};
