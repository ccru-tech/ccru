import z from 'zod'

// Schema de campo de senha
const minLengthErrorMessage = 'Sua senha deve conter ao menos oito caracteres.'
const maxLengthErrorMessage = 'Sua senha não pode ter mais de 20 caracteres.'
export const passwordSchema = z
  .string()
  .min(8, { message: minLengthErrorMessage })
  .max(20, { message: maxLengthErrorMessage })

export const registerFormSchema = z
  .object({
    name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })
