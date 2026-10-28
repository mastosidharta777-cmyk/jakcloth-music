import Link from 'next/link'
import FanChoice from '@/components/FanChoice'

export default function FanChoicePage() {
  return (
    <div className="min-h-screen bg-neutral-950 pb-16 text-white">
      <header className="border-b border-neutral-800 bg-neutral-900/95">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-bold tracking-wide text-white hover:text-red-300">
            <span className="rounded-md bg-red-600 px-2 py-2 text-lg font-black leading-none">JC</span>
            <span>JAKCLOTH <span className="text-red-500">MUSIC & MERCH</span></span>
          </Link>
          <Link href="/#fan-choice" className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:border-red-500">← Kembali ke aplikasi</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pt-6">
        <FanChoice />
      </main>
    </div>
  )
}
