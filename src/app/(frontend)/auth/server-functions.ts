'use server'

import config from '@payload-config'
import { login } from '@payloadcms/next/auth'
import { getPayload } from 'payload'
import z from 'zod'
import { registerFormSchema } from './authConfig'

export const registerUser = async (values: z.infer<typeof registerFormSchema>) => {
  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'users',
      data: values,
    })
    return { success: true, message: 'Usuário criado com sucesso!' }
  } catch (error) {
    console.error(`Register failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return {
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

export async function loginAction({ email, password }: { email: string; password: string }) {
  try {
    await login({
      collection: 'users',
      config,
      email,
      password,
    })
    return { success: true, message: 'Bem vindo de volta.' }
  } catch (error) {
    console.error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return {
      success: false,
      message: `${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
