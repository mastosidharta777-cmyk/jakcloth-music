'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Artist = {
  id: string
  name: string
  genre: string
  isSuggestion?: boolean
}

type Support = {
  artistId: string
  city: string
}

type SavedFanChoice = {
  suggestions: Artist[]
  supports: Support[]
}

const STORAGE_KEY = 'jakcloth-fan-choice-demo-v1'

const ARTISTS: Artist[] = [
  { id: 'for-revenge', name: 'For Revenge', genre: 'Alternative Rock' },
  { id: 'daun-jatuh', name: 'Daun Jatuh', genre: 'Pop Alternatif' },
  { id: 'the-lantis', name: 'The Lantis', genre: 'Indie Pop' },
  { id: 'the-sigit', name: 'The Sigit', genre: 'Rock' },
  { id: 'reality-club', name: 'Reality Club', genre: 'Indie Pop' },
  { id: 'sukatani', name: 'Sukatani', genre: 'Punk / Alternatif' },
]

const CITIES = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Bali', 'Kota lainnya']
const GENRES = ['Indie Pop', 'Rock', 'Pop Alternatif', 'Punk', 'Hardcore', 'Hip-Hop', 'Metal', 'Elektronik', 'Lainnya']

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('id-ID')
}

function isArtist(item: unknown): item is Artist {
  if (!item || typeof item !== 'object') return false
  const record = item as Record<string, unknown>
  return typeof record.id === 'string' && typeof record.name === 'string' && typeof record.genre === 'string'
}

function isSupport(item: unknown): item is Support {
  if (!item || typeof item !== 'object') return false
  const record = item as Record<string, unknown>
  return typeof record.artistId === 'string' && typeof record.city === 'string'
}

export default function FanChoicePage() {
  const [ready, setReady] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Jakarta')
  const [customCity, setCustomCity] = useState('')
  const [tab, setTab] = useState<'list' | 'suggest'>('list')
  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newGenre, setNewGenre] = useState('Indie Pop')
  const [suggestions, setSuggestions] = useState<Artist[]>([])
  const [supports, setSupports] = useState<Support[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedFanChoice>
        if (Array.isArray(saved.suggestions)) {
          setSuggestions(saved.suggestions.filter(isArtist).slice(0, 100))
        }
        if (Array.isArray(saved.supports)) {
          setSupports(saved.supports.filter(isSupport).slice(0, 200))
        }
      }
    } catch {
      // Demo tetap dapat digunakan saat penyimpanan browser tidak tersedia.
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ suggestions, supports } satisfies SavedFanChoice))
    } catch {
      setMessage('Penyimpanan browser tidak tersedia. Pilihan hanya tersimpan selama halaman terbuka.')
    }
  }, [ready, suggestions, supports])

  const city = selectedCity === 'Kota lainnya' ? customCity.trim().replace(/\s+/g, ' ') : selectedCity
  const cityValid = city.length >= 2 && city.length <= 60
  const allArtists = useMemo(() => [...ARTISTS, ...suggestions], [suggestions])
  const filtered = useMemo(() => {
    const term = normalizeName(search)
    return allArtists.filter(a => !term || normalizeName(a.name).includes(term) || normalizeName(a.genre).includes(term))
  }, [allArtists, search])
  const mySupports = supports.filter(s => s.city === city)
  const supportedIds = new Set(mySupports.map(s => s.artistId))
  const selectedArtists = allArtists.filter(a => supportedIds.has(a.id))

  function toggleSupport(artist: Artist) {
    if (!cityValid) {
      setMessage('Pilih atau tuliskan kota tempat kamu ingin menonton terlebih dahulu.')
      return
    }
    const exists = supports.some(s => s.artistId === artist.id && s.city === city)
    setSupports(current => exists
      ? current.filter(s => !(s.artistId === artist.id && s.city === city))
      : [...current.filter(s => !(s.artistId === artist.id && s.city === city)), { artistId: artist.id, city }])
    setMessage(exists ? 'Dukungan untuk ' + artist.name + ' dibatalkan di ' + city + '.' : 'Dukungan untuk ' + artist.name + ' di ' + city + ' tersimpan pada perangkat ini.')
  }

  function submitSuggestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const cleanName = newName.trim().replace(/\s+/g, ' ').slice(0, 80)
    if (cleanName.length < 2) {
      setMessage('Nama artis/band minimal dua karakter.')
      return
    }
    if (!cityValid) {
      setMessage('Pilih kota tujuan menonton terlebih dahulu.')
      return
    }
    const existing = allArtists.find(a => normalizeName(a.name) === normalizeName(cleanName))
    if (existing) {
      const hasSupport = supports.some(s => s.artistId === existing.id && s.city === city)
      if (!hasSupport) {
        setSupports(current => [...current, { artistId: existing.id, city }])
      }
      setMessage('Artis sudah ada di daftar. Dukunganmu untuk ' + existing.name + ' di ' + city + ' sudah tersimpan.')
      setTab('list')
      setSearch(existing.name)
      setNewName('')
      return
    }
    const newArtist: Artist = {
      id: 'suggested-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
      name: cleanName,
      genre: newGenre,
      isSuggestion: true,
    }
    setSuggestions(current => [...current, newArtist])
    setSupports(current => [...current, { artistId: newArtist.id, city }])
    setNewName('')
    setTab('list')
    setSearch(cleanName)
    setMessage('Usulan ' + cleanName + ' dan dukunganmu untuk kota ' + city + ' tersimpan di browser ini.')
  }

  return (
    <div className="min-h-screen bg-neutral-950 pb-20 text-white">
      <header className="border-b border-neutral-800 bg-neutral-900/95">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-bold tracking-wide text-white hover:text-red-300">
            <span className="rounded-md bg-red-600 px-2 py-2 font-black text-lg leading-none">JC</span>
            <span>JAKCLOTH <span className="text-red-500">MUSIC & MERCH</span></span>
          </Link>
          <Link href="/" className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:border-red-500">← Kembali ke aplikasi</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="relative mt-6 overflow-hidden rounded-2xl border border-red-900/40 bg-gradient-to-br from-red-950 via-neutral-900 to-neutral-950 p-5 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-red-300">Simulasi interaktif</span>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Fan <span className="text-red-500">Choice</span></h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-200">
            Artis siapa yang ingin kamu lihat di panggung JakCloth berikutnya? Dukung artis favorit atau usulkan nama yang belum ada.
          </p>
          <p className="mt-3 max-w-2xl text-xs text-neutral-400">
            Ini demo. Nama artis hanya contoh, belum merupakan kandidat resmi. Dukungan dan usulan disimpan di browser perangkatmu, bukan dikirim ke JakCloth. Tidak ada angka suara publik.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Pilih kota konser</h2>
              <p className="text-sm text-neutral-400">Dukungan artis dicatat terpisah untuk setiap kota.</p>
            </div>
            <span className="text-sm font-semibold text-red-300">{ready ? mySupports.length : '...'} dukunganmu di {city || 'kota pilihan'}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {CITIES.map(c => (
              <button key={c} type="button" onClick={() => { setSelectedCity(c); setMessage('') }}
                aria-pressed={selectedCity === c}
                className={'rounded-lg border px-4 py-2 text-sm transition ' + (selectedCity === c ? 'border-red-500 bg-red-600 font-bold text-white' : 'border-neutral-700 bg-neutral-950 text-neutral-200 hover:border-neutral-400')}>
                {c}
              </button>
            ))}
          </div>
          {selectedCity === 'Kota lainnya' && (
            <label className="mt-4 block max-w-md text-sm text-neutral-200">
              Nama kota
              <input value={customCity} onChange={e => setCustomCity(e.target.value.slice(0, 60))}
                maxLength={60} placeholder="Contoh: Semarang" className="mt-2 w-full rounded-lg border border-neutral-600 bg-neutral-950 px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
            </label>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
          <div role="tablist" aria-label="Jenis partisipasi Fan Choice" className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-950 p-1">
            <button type="button" role="tab" aria-selected={tab === 'list'} onClick={() => { setTab('list'); setMessage('') }}
              className={'rounded-lg px-3 py-3 text-sm font-bold ' + (tab === 'list' ? 'bg-red-600 text-white' : 'text-neutral-300 hover:bg-neutral-800')}>
              Pilih artis
            </button>
            <button type="button" role="tab" aria-selected={tab === 'suggest'} onClick={() => { setTab('suggest'); setMessage('') }}
              className={'rounded-lg px-3 py-3 text-sm font-bold ' + (tab === 'suggest' ? 'bg-red-600 text-white' : 'text-neutral-300 hover:bg-neutral-800')}>
              Usulkan artis baru
            </button>
          </div>

          {message && <div role="status" aria-live="polite" className="mt-4 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-100">{message}</div>}

          {tab === 'list' ? (
            <div className="mt-5">
              <label htmlFor="search-artists" className="block text-sm font-medium text-neutral-300">Cari artis, band, atau genre</label>
              <input id="search-artists" type="search" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama artis ..." className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white placeholder:text-neutral-500 focus:border-red-500 focus:outline-none" />
              <p className="mb-4 mt-3 text-xs text-neutral-400">Daftar contoh untuk simulasi. Tombol Dukung tidak mengirim suara ke server.</p>
              <div className="space-y-3">
                {filtered.map((artist, index) => {
                  const supported = supportedIds.has(artist.id)
                  return (
                    <div key={artist.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-950 p-3 sm:flex-nowrap">
                      <div aria-hidden="true" className={'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl font-black ' + (index % 2 === 0 ? 'bg-gradient-to-br from-red-800 to-neutral-900' : 'bg-gradient-to-br from-indigo-900 to-neutral-900')}>♪</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white">{artist.name}</p>
                        <p className="text-xs text-neutral-400">{artist.genre} {artist.isSuggestion ? '· Usulanmu (demo)' : '· Artis contoh'}</p>
                      </div>
                      <button type="button" onClick={() => toggleSupport(artist)}
                        aria-pressed={supported} disabled={!ready || !cityValid}
                        className={'rounded-lg border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 ' + (supported ? 'border-red-700 bg-red-950 text-red-200' : 'border-red-600 bg-red-600 text-white hover:bg-red-700')}>
                        {supported ? '♥ Didukung' : '♡ Dukung'}
                      </button>
                    </div>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="rounded-xl border border-dashed border-neutral-700 p-6 text-center">
                    <p className="text-neutral-300">Artis tidak ditemukan.</p>
                    <button type="button" onClick={() => { setNewName(search); setTab('suggest'); setMessage('') }} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold">Usulkan nama ini</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={submitSuggestion} className="mt-5 space-y-4">
              <p className="text-sm text-neutral-300">Belum menemukan artis pilihan? Tulis nama band atau musisi. Sistem contoh akan menggabungkan nama yang sama dan otomatis mencatat dukunganmu untuk kota yang dipilih.</p>
              <label className="block text-sm font-medium">
                Nama artis / band <span className="text-red-400">*</span>
                <input required minLength={2} maxLength={80} value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder="Contoh: nama band favorit" className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white focus:border-red-500 focus:outline-none" />
              </label>
              <label className="block text-sm font-medium">
                Genre
                <select value={newGenre} onChange={e => setNewGenre(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white focus:border-red-500 focus:outline-none">
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </label>
              <p className="text-sm text-neutral-400">Kota tujuan: <span className="font-semibold text-white">{cityValid ? city : 'Belum valid'}</span></p>
              <button type="submit" disabled={!ready || !cityValid || newName.trim().length < 2}
                className="w-full rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                Kirim usulan (demo)
              </button>
            </form>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
          <h2 className="text-lg font-bold">Dukungan saya {cityValid ? '— ' + city : ''}</h2>
          <p className="mt-1 text-sm text-neutral-400">Pilihan ini tersimpan di perangkat, bukan menjadi hasil voting publik.</p>
          {selectedArtists.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedArtists.map(a => <span key={a.id} className="rounded-full border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-100">♥ {a.name}</span>)}
            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-500">Belum ada artis yang kamu dukung untuk kota ini.</p>
          )}
        </section>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-neutral-500">
          Hasil dukungan dan usulan nantinya dapat menjadi masukan kurasi JakCloth setelah sistem akun, moderasi, dan penghitungan suara yang sah tersedia. Partisipasi tidak menjamin artis tampil.
        </p>
      </main>
    </div>
  )
}
