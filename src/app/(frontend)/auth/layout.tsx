import { Leaf } from 'lucide-react'

export type AuthLayoutProps = {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4 py-6 sm:py-10 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <img src="/logo.avif" alt="" className="h-36 mx-auto" />

        <div className={'flex flex-col gap-6'}>{children}</div>
      </div>
    </div>
  )
}
