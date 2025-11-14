import { redirect } from 'next/navigation'

export type HomeProps = {}

export default async function Home(props: HomeProps) {
  return (
    <div className="min-h-svh w-full flex items-center justify-center">
      <div className="">
        <h1 className="text-5xl font-bold">CCRU</h1>
      </div>
    </div>
  )
}
