'use client'

import React, { useState, useEffect, useRef } from 'react'
import { merchandise } from '@/lib/data'

interface Track {
  id: string
  title: string
  artist: string
  type: string
  duration: string
  audioUrl: string
  videoUrl?: string
}

interface Merchandise {
  id: string
  brand: string
  title: string
  price: string
  discountPrice: string
  stock: number
  claimed: number
  code: string
  image: string
}

export default function Page() {
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('video')
  const [livePreviewFinished, setLivePreviewFinished] = useState(false)
  const [finishedCompilationTrack, setFinishedCompilationTrack] = useState<string | null>(null)
  const [showQrisModal, setShowQrisModal] = useState(false)
  const [selectedPaymentItem, setSelectedPaymentItem] = useState<{ name: string; price: string; flexible?: boolean } | null>(null)
  const [supportAmount, setSupportAmount] = useState(10000)
  const [followedArtists, setFollowedArtists] = useState<string[]>([])
  const [inlineTrackId, setInlineTrackId] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<{ src: string; alt: string } | null>(null)
  const photoReturnFocusRef = useRef<HTMLElement | null>(null)
  const photoCloseRef = useRef<HTMLButtonElement>(null)
  const inlineAudioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const tracks: Track[] = [
    {
      id: 't1',
      title: 'Serana (Live at RockAroma JakCloth 2023)',
      artist: 'For Revenge',
      type: 'Live',
      duration: '05:48',
      audioUrl: '/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp3',
      videoUrl: '/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp4'
    },
    {
      id: 'r1',
      title: 'bukan tentangmu',
      artist: 'Daun Jatuh',
      type: 'Romantika Urban Kontemporer',
      duration: '04:12',
      audioUrl: '/media/Daun Jatuh - bukan tentangmu.mp3'
    },
    {
      id: 'r2',
      title: 'Alive',
      artist: 'Dear9Three',
      type: 'Romantika Urban Kontemporer',
      duration: '03:58',
      audioUrl: '/media/Dear9Three - Alive.mp3'
    },
    {
      id: 'r3',
      title: '1,2,3',
      artist: '1 Tengah',
      type: 'Romantika Urban Kontemporer',
      duration: '03:26',
      audioUrl: '/media/1 Tengah - 1,2,3.mp3'
    },
    {
      id: 'r4',
      title: 'Benua Yang Hilang',
      artist: 'The Lantis',
      type: 'Romantika Urban Kontemporer',
      duration: '04:05',
      audioUrl: '/media/The Lantis - Benua Yang Hilang.mp3'
    },
    {
      id: 'm1',
      title: 'BAB III',
      artist: 'The Skit',
      type: 'Manifesto Gigs Bawah',
      duration: '03:47',
      audioUrl: '/media/The Skit - BAB III.mp3'
    },
    {
      id: 'm2',
      title: 'Kebelet',
      artist: 'Sukses Lancar Rejeki',
      type: 'Manifesto Gigs Bawah',
      duration: '03:22',
      audioUrl: '/media/Sukses Lancar Rejeki - Kebelet.mp3'
    },
    {
      id: 'm3',
      title: 'Lucid',
      artist: 'CLOSEME',
      type: 'Manifesto Gigs Bawah',
      duration: '03:54',
      audioUrl: '/media/CLOSEME - Lucid.mp3'
    },
    {
      id: 'm4',
      title: 'Punk!',
      artist: 'The Sidhartas',
      type: 'Manifesto Gigs Bawah',
      duration: '02:58',
      audioUrl: '/media/The Sidhartas - Punk!.mp3'
    },
    {
      id: 's1',
      title: 'Asa',
      artist: 'Undelayed',
      type: 'Sakramen Kebisingan Ekstrim',
      duration: '04:01',
      audioUrl: '/media/UNDELAYED - ASA.mp3'
    },
    {
      id: 's2',
      title: 'Paranoid',
      artist: 'Hellfreezed',
      type: 'Sakramen Kebisingan Ekstrim',
      duration: '03:39',
      audioUrl: '/media/Hellfreezed - Paranoid.mp3'
    },
    {
      id: 's3',
      title: 'Never Forever',
      artist: 'Revenge The Fate',
      type: 'Sakramen Kebisingan Ekstrim',
      duration: '04:16',
      audioUrl: '/media/Revenge The Fate - Never Forever.mp3'
    },
    {
      id: 's4',
      title: 'Carry My Regret',
      artist: 'I Only Exist When You Remember Me',
      type: 'Sakramen Kebisingan Ekstrim',
      duration: '04:24',
      audioUrl: '/media/I Only Exist When You Remember Me - Carry My Regret.mp3'
    }
  ]

  // Only the following audio files exist in public/media for this demo.
  const availableAudioPaths = new Set([
    '/media/Daun Jatuh - bukan tentangmu.mp3',
    '/media/The Skit - BAB III.mp3',
    '/media/UNDELAYED - ASA.mp3',
    '/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp3'
  ])

  const albums = [
    {
      id: 'romantika',
      name: 'Romantika Urban Kontemporer',
      genre: 'Pop Alternatif',
      cover: '/media/Jakcloth Urban Kontemporer - Kompilasi Pop alternativ.jpeg'
    },
    {
      id: 'manifesto',
      name: 'Manifesto Gigs Bawah',
      genre: 'Underground',
      cover: '/media/Jakcloth - MGBT - artwork.jpg'
    },
    {
      id: 'sakramen',
      name: 'Sakramen Kebisingan Ekstrim',
      genre: 'Hardcore/Noise',
      cover: '/media/Jakcloth - SKE - artwork.jpg'
    }
  ]

  const [activeTrack, setActiveTrack] = useState<Track>(tracks[0])
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null)

  const [merchList, setMerchList] = useState<Merchandise[]>([
    {
      id: 'm1',
      brand: 'ERIGO',
      title: 'Official JakCloth Edition Oversized Tee',
      price: 'Rp 185.000',
      discountPrice: 'Rp 99.000',
      stock: 150,
      claimed: 42,
      code: 'JKT-ERIGO-TSHIRT',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'm2',
      brand: 'ROUGHNECK 1991',
      title: 'JakCloth Special Edition Heavyweight Hoodie',
      price: 'Rp 350.000',
      discountPrice: 'Rp 199.000',
      stock: 100,
      claimed: 68,
      code: 'JKT-RN-HOODIE',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'm3',
      brand: 'SCREAMOUS',
      title: 'Limited Festival Trucker Cap',
      price: 'Rp 120.000',
      discountPrice: 'Rp 65.000',
      stock: 80,
      claimed: 51,
      code: 'JKT-SCR-CAP',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'm4',
      brand: 'SHINING BRIGHT',
      title: 'Festival Coach Jacket',
      price: 'Rp 399.000',
      discountPrice: 'Rp 249.000',
      stock: 50,
      claimed: 38,
      code: 'JKT-SB-JACKET',
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=60'
    }
  ])
  const [activeQR, setActiveQR] = useState<{ code: string; title: string; brand: string } | null>(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('jakcloth-follow-demo') || '[]')
      if (Array.isArray(saved)) setFollowedArtists(saved.filter((name): name is string => typeof name === 'string'))
    } catch {}
  }, [])

  useEffect(() => {
    if (!inlineTrackId) return
    // Playback is requested by tapping a track, but can be blocked by browser settings.
    void inlineAudioRef.current?.play().catch(() => {})
  }, [inlineTrackId])

  const openPhotoPreview = (event: React.MouseEvent<HTMLButtonElement>, title: string) => {
    event.stopPropagation()
    // Show exactly the image already displayed, including its optional fallback.
    const src = event.currentTarget.querySelector('img')?.currentSrc
    if (!src) return
    photoReturnFocusRef.current = event.currentTarget
    setPhotoPreview({src, alt:title})
  }

  useEffect(() => {
    if (!photoPreview) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    photoCloseRef.current?.focus()
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPhotoPreview(null)
    }
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('keydown', onEscape)
      document.body.style.overflow = previousOverflow
      photoReturnFocusRef.current?.focus()
    }
  }, [photoPreview])

  const selectCompilationTrack = (trackId: string) => {
    videoRef.current?.pause()
    audioRef.current?.pause()
    inlineAudioRef.current?.pause()
    setFinishedCompilationTrack(null)
    setInlineTrackId(previous => previous === trackId ? null : trackId)
  }

  function toggleFollow(artist: string) {
    setFollowedArtists((previous) => {
      const next = previous.includes(artist) ? previous.filter((name) => name !== artist) : [...previous, artist]
      try { localStorage.setItem('jakcloth-follow-demo', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const handleQrisSuccess = () => {
    if (selectedPaymentItem?.flexible && (!Number.isSafeInteger(supportAmount) || supportAmount < 10000 || supportAmount > 10000000)) return
    setShowQrisModal(false)
    if (inlineTrackId) {
      void inlineAudioRef.current?.play().catch(() => {})
    } else if (mediaType === 'video' && videoRef.current) {
      void videoRef.current.play().catch(() => {})
    } else if (mediaType === 'audio' && audioRef.current) {
      void audioRef.current.play().catch(() => {})
    }
  }

  const handleClaimMerch = async (item: Merchandise) => {
    if (item.claimed >= item.stock) return
    const newClaimed = item.claimed + 1
    setMerchList((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, claimed: newClaimed } : m))
    )
    setActiveQR({ code: item.code, title: item.title, brand: item.brand })
    // Demo only. No database write or real inventory reservation.
  }

  const handleBuyDigitalPass = () => {
    setSupportAmount(10000)
    setSelectedPaymentItem({name: 'Live at JakCloth — '+activeTrack.artist, price:'Mulai Rp10.000',flexible:true})
    setShowQrisModal(true)
  }

  const handleBuyDigitalAlbum = (name = 'Kompilasi JakCloth') => {
    setSupportAmount(10000)
    setSelectedPaymentItem({name,price:'Mulai Rp10.000',flexible:true})
    setShowQrisModal(true)
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-16">
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-black text-white text-xl">J</div>
          <span className="font-bold text-lg tracking-wider text-white">
            JAKCLOTH <span className="text-red-500">MUSIC & MERCH</span>
          </span>
        </div>
        <span className="text-xs bg-red-950 text-red-400 border border-red-800/50 px-2.5 py-1 rounded-full font-mono">
          LIVE FESTIVAL APP
        </span>
      </header>

      <nav aria-label="Navigasi JakCloth" className="max-w-4xl mx-auto px-4 pt-3 flex gap-2 overflow-x-auto text-xs">
        {[['#tickets','Tiket'],['#live','Live'],['#music','Kompilasi'],['#merch','Merch'],['#artists','Artis Favorit']].map(([href,label]) =>
          <a key={href} href={href} className="shrink-0 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-200 hover:border-red-500">{label}</a>)}
      </nav>
      <main className="max-w-4xl mx-auto px-4 mt-5 space-y-8">
        <section id="tickets" className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 scroll-mt-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Events & Tickets</p>
          <h2 className="text-xl font-bold text-white mt-1">Tiket Event JakCloth</h2>
          <p className="text-sm text-neutral-400 mt-2">Temukan event, beli tiket online, dan simpan e-ticket QR untuk masuk.</p>
          <div className="mt-4 rounded-lg bg-neutral-950 border border-neutral-800 p-4">
            <p className="font-semibold text-sm text-white">Jadwal event berikutnya belum dimasukkan</p>
            <p className="text-xs text-neutral-400 mt-1">Ini demo. Penjualan tiket, pembayaran, dan e-ticket belum aktif.</p>
            <button type="button" disabled className="mt-3 px-4 py-2 bg-neutral-800 rounded text-neutral-400 text-sm cursor-not-allowed">Tiket segera tersedia</button>
          </div>
        </section>
        <section id="live" className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden scroll-mt-24">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center flex-wrap gap-2">
            <div>
              <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">Live at JakCloth · Demo</span>
              <h2 className="text-xl font-bold">{activeTrack.artist} — {activeTrack.title}</h2>
            </div>
            <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => activeTrack.videoUrl && setMediaType('video')}
                disabled={!activeTrack.videoUrl}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${mediaType === 'video' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}
              >
                Video Stream
              </button>
              <button
                onClick={() => setMediaType('audio')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${mediaType === 'audio' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}
              >
                Audio Stream
              </button>
            </div>
          </div>

          <div className="bg-black flex items-center justify-center min-h-[260px]">
            {mediaType === 'video' && activeTrack.videoUrl ? (
              <video
                ref={videoRef}
                key={activeTrack.videoUrl || activeTrack.id}
                controls
                controlsList="nodownload"
                onPlay={() => {
                  inlineAudioRef.current?.pause()
                  setInlineTrackId(null)
                  setLivePreviewFinished(false)
                }}
                onEnded={() => setLivePreviewFinished(true)}
                className="w-full aspect-video rounded-b-xl"
                poster="/media/For Revenge Rockaroma Live Performance.png"
              >
                <source src={activeTrack.videoUrl} type="video/mp4" />
                Browser Anda tidak mendukung HTML5 video.
              </video>
            ) : (
              <div className="w-full p-8 flex flex-col items-center justify-center text-center bg-neutral-950">
                <span className="text-xs font-mono text-red-400 mb-2">High Quality Audio Stream</span>
                <p className="font-bold text-lg text-white mb-4">{activeTrack.title} — <span className="text-neutral-400">{activeTrack.artist}</span></p>
                <audio ref={audioRef} key={activeTrack.audioUrl} controls src={activeTrack.audioUrl} className="w-full max-w-md" onPlay={() => {
                  inlineAudioRef.current?.pause()
                  setInlineTrackId(null)
                }} onEnded={() => setLivePreviewFinished(true)}>
                  Browser Anda tidak mendukung HTML5 audio.
                </audio>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-neutral-800 flex flex-wrap gap-3 items-center justify-between">
            <p className="text-xs text-neutral-400">{livePreviewFinished ? 'Terima kasih sudah menikmati satu lagu lengkap. Dukung artis jika ingin membantu karya dan rekaman berikutnya.' : 'Satu lagu live bisa dinikmati penuh secara gratis. Nantinya, konser lengkap menawarkan beberapa lagu gratis sebelum akses penuh.'}</p>
            <button type="button" onClick={handleBuyDigitalPass} className="rounded bg-red-600 px-3 py-2 text-sm text-white font-semibold">Dukung artis · Mulai Rp10.000</button>
          </div>
        </section>

        <section id="music" className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 scroll-mt-24">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Kompilasi Album JakCloth</h3>
            <p className="text-xs text-neutral-400">Pilih artwork album untuk melihat daftar lagu</p>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => {
                  inlineAudioRef.current?.pause()
                  setInlineTrackId(null)
                  setFinishedCompilationTrack(null)
                  setSelectedAlbum(album.id === selectedAlbum ? null : album.id)
                }}
                className={`min-w-[260px] md:min-w-0 cursor-pointer rounded-lg border overflow-hidden transition ${
                  selectedAlbum === album.id ? 'border-red-600' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <button type="button" onClick={(event) => openPhotoPreview(event, album.name)} aria-label={`Perbesar artwork ${album.name}`} className="relative group block w-full text-left">
                  <img
                    src={album.cover}
                    alt={album.name}
                    className="w-full h-40 md:h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60'
                    }}
                  />
                  <span aria-hidden="true" className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-[11px] text-white">Perbesar foto</span>
                </button>
                <div className="p-3 bg-neutral-950">
                  <p className="text-sm font-bold text-white">{album.name}</p>
                  <p className="text-xs text-neutral-400">{album.genre}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBuyDigitalAlbum(album.name)
                    }}
                    className="mt-2 w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition"
                  >
                    Dukung & Buka Album · Mulai Rp10.000
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedAlbum && (
            <div className="mt-5">
              {albums
                .filter((album) => album.id === selectedAlbum)
                .map((album) => {
                  const albumTracks = tracks.filter((track) => {
                    if (album.id === 'romantika') return track.type === 'Romantika Urban Kontemporer'
                    if (album.id === 'manifesto') return track.type === 'Manifesto Gigs Bawah'
                    if (album.id === 'sakramen') return track.type === 'Sakramen Kebisingan Ekstrim'
                    return false
                  })
                  return (
                    <div key={album.id} className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                  <button type="button" onClick={(event) => openPhotoPreview(event, album.name)} aria-label={`Perbesar artwork ${album.name}`} className="shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                    <img
                      src={album.cover}
                      alt={album.name}
                      className="w-16 h-16 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60'
                      }}
                    />
                  </button>
                        <div>
                          <p className="font-bold text-white">{album.name}</p>
                          <p className="text-xs text-neutral-400">{album.genre}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {albumTracks.map((track, idx) => {
                          const playable = availableAudioPaths.has(track.audioUrl)
                          const expanded = inlineTrackId === track.id && playable
                          return (
                            <div key={track.id} className={`rounded-lg border overflow-hidden ${expanded ? 'border-red-600/50 bg-red-950/20' : 'border-neutral-800 bg-neutral-950'}`}>
                              <button
                                type="button"
                                disabled={!playable}
                                aria-expanded={expanded}
                                aria-controls={playable ? `inline-player-${track.id}` : undefined}
                                onClick={() => selectCompilationTrack(track.id)}
                                className="w-full p-3 text-left flex items-center justify-between gap-3 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-neutral-900/70 transition"
                              >
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold text-white">{idx + 1}. {track.title}</span>
                                  <span className="block text-xs text-neutral-400">{track.artist}</span>
                                </span>
                                <span className="shrink-0 text-xs text-neutral-500 font-mono">{playable ? (expanded ? 'Tutup player' : track.duration) : 'Audio menyusul'}</span>
                              </button>
                              {expanded && (
                                <div id={`inline-player-${track.id}`} className="px-3 pb-3">
                                  <p className="mb-2 text-xs text-emerald-300">Lagu demo gratis · Bisa didengarkan sampai selesai</p>
                                  <audio
                                    ref={inlineAudioRef}
                                    src={track.audioUrl}
                                    controls
                                    preload="metadata"
                                    onPlay={() => {
                                      setFinishedCompilationTrack(null)
                                      videoRef.current?.pause()
                                      audioRef.current?.pause()
                                    }}
                                    onEnded={() => setFinishedCompilationTrack(track.id)}
                                    className="w-full"
                                  >
                                    Browser Anda tidak mendukung pemutar audio.
                                  </audio>
                                  {finishedCompilationTrack === track.id && (
                                    <div role="status" className="mt-3 rounded-lg border border-neutral-700 bg-neutral-950 p-3 text-sm">
                                      <p className="text-neutral-300">Suka lagu ini? Dukung para artis di album {album.name}.</p>
                                      <button type="button" onClick={() => handleBuyDigitalAlbum(album.name)} className="mt-2 rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Dukung album · Mulai Rp10.000 (Demo)</button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </section>

        <section id="merch" className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 scroll-mt-24">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Merchandise Cross-Reward Demo</h3>
            <p className="text-xs text-emerald-400">Beli Merch = Bonus Gratis Digital Master Audio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {merchandise.map((item: any) => (
              <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
                <div className="relative">
                  <button type="button" onClick={(event) => openPhotoPreview(event, item.name)} aria-label={`Perbesar foto ${item.name}`} className="block w-full text-left">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60'
                      }}
                    />
                  </button>
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-600 text-white px-2 py-1 rounded">{item.badge}</span>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                  <p className="text-sm font-bold text-red-400 mt-1">{item.price}</p>
                  <button onClick={() => {setSelectedPaymentItem({name:item.name,price:item.price});setShowQrisModal(true)}} className="mt-auto w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition">
                    Beli Merch & Unlock Audio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Merchandise & Voucher Booth Official</h3>
            <p className="text-xs text-neutral-400">Contoh voucher demo; kode belum valid untuk ditukar di booth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {merchList.map((item) => {
              const isSoldOut = item.claimed >= item.stock
              return (
                <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 flex gap-3 items-center">
                  <button type="button" onClick={(event) => openPhotoPreview(event, item.title)} aria-label={`Perbesar foto ${item.title}`} className="shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-md bg-neutral-900"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60'
                      }}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{item.brand}</span>
                    <h4 className="font-semibold text-white text-xs truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-400">{item.discountPrice}</span>
                      <span className="text-[10px] text-neutral-500 line-through">{item.price}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1 font-mono">
                      Stok: <span className="text-white font-bold">{item.stock - item.claimed}</span> / {item.stock}
                    </p>
                  </div>
                  <button
                    onClick={() => handleClaimMerch(item)}
                    disabled={isSoldOut}
                    className={`px-3 py-2 rounded text-xs font-bold transition whitespace-nowrap ${isSoldOut ? 'bg-neutral-800 text-neutral-500' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                  >
                    {isSoldOut ? 'Habis' : 'Klaim QR'}
                  </button>
                </div>
              )
            })}
          </div>

          {activeQR && (
            <div className="mt-6 p-4 bg-neutral-950 border border-red-900/50 rounded-xl flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-emerald-400 mb-1">Voucher Demo Dibuat — Bukan Voucher Resmi</span>
              <p className="text-xs text-neutral-400 font-mono mb-1">{activeQR.brand}</p>
              <p className="text-sm font-bold text-white mb-3">{activeQR.title}</p>
              <div className="p-3 bg-white rounded-lg">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(activeQR.code)}`} alt="Voucher QR Code" className="w-40 h-40" />
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-3">Kode Demo (Tidak Berlaku di Kasir): <span className="text-white font-bold">{activeQR.code}</span></p>
              <button onClick={() => setActiveQR(null)} className="mt-3 text-xs text-neutral-500 hover:text-white underline">Tutup QR Code</button>
            </div>
          )}
        </section>

        <section id="artists" className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 scroll-mt-24">
          <h3 className="text-lg font-bold text-white">Artis Favorit</h3>
          <p className="text-xs text-neutral-400 mt-1">Ikuti artis untuk menemukannya kembali. Demo menyimpan pilihan hanya di browser ini, tanpa notifikasi.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {Array.from(new Set(tracks.map(track => track.artist))).map(artist => (
              <div key={artist} className="flex items-center justify-between gap-2 rounded-lg bg-neutral-950 border border-neutral-800 p-3">
                <span className="text-sm text-neutral-100 truncate">{artist}</span>
                <button type="button" aria-pressed={followedArtists.includes(artist)} onClick={() => toggleFollow(artist)} className={(followedArtists.includes(artist) ? 'bg-neutral-700' : 'bg-red-600 hover:bg-red-700') + ' shrink-0 rounded px-3 py-2 text-xs font-bold text-white'}>
                  {followedArtists.includes(artist) ? 'Mengikuti' : '+ Ikuti'}
                </button>
              </div>
            ))}
          </div>
          {followedArtists.length > 0 && <p className="text-xs text-neutral-400 mt-3">{followedArtists.length} artis diikuti di perangkat ini.</p>}
        </section>
      </main>

      {photoPreview && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-3 sm:p-8"
          role="presentation"
          onClick={() => setPhotoPreview(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Foto diperbesar: ${photoPreview.alt}`}
            className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col items-center gap-3 rounded-xl bg-neutral-950 p-3 sm:p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={photoCloseRef}
              type="button"
              onClick={() => setPhotoPreview(null)}
              aria-label="Tutup foto"
              className="self-end rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
            >
              Tutup ×
            </button>
            <img
              src={photoPreview.src}
              alt={photoPreview.alt}
              className="max-h-[76dvh] max-w-full rounded-md object-contain"
            />
            <p className="max-w-full truncate text-center text-xs text-neutral-300">{photoPreview.alt}</p>
          </div>
        </div>
      )}

      {showQrisModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-1">Simulasi Checkout JakCloth</h3>
              <p className="text-sm text-neutral-400">Demo ini tidak memproses pembayaran atau membayar royalti.</p>
            </div>
            <div className="mb-4 p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
              <p className="text-sm font-semibold text-white">{selectedPaymentItem?.name}</p>
              <p className="text-lg font-bold text-red-400 mt-1">{selectedPaymentItem?.flexible ? 'Rp '+supportAmount.toLocaleString('id-ID') : selectedPaymentItem?.price}</p>
            </div>
            {selectedPaymentItem?.flexible && (
              <div className="text-left space-y-3 mb-4">
                <p className="text-sm text-neutral-300">Dukung artis favoritmu dan nikmati seluruh karya. Bayar sesuai keinginan, mulai Rp10.000.</p>
                <div className="grid grid-cols-3 gap-2">
                  {[10000,25000,50000].map(amount => (
                    <button key={amount} type="button" onClick={() => setSupportAmount(amount)} className={(supportAmount === amount ? 'bg-red-600 border-red-600' : 'bg-neutral-800 border-neutral-600')+' rounded border py-2 text-xs text-white'}>Rp{amount.toLocaleString('id-ID')}</button>
                  ))}
                </div>
                <label htmlFor="support-amount" className="block text-xs text-neutral-400">Atau nominal lain (rupiah)</label>
                <input id="support-amount" type="number" min={10000} max={10000000} step={1000} value={supportAmount || ''} onChange={e => setSupportAmount(Number(e.target.value))} className="w-full bg-neutral-950 border border-neutral-600 rounded p-2 text-white" />
                {(!Number.isSafeInteger(supportAmount)||supportAmount<10000||supportAmount>10000000) && <p role="alert" className="text-xs text-red-400">Minimal Rp10.000; maksimal Rp10.000.000.</p>}
              </div>
            )}
            <p className="text-xs text-amber-300 mb-4">Tidak ada QRIS asli pada demo ini. Tombol hanya simulasi.</p>
            <button
              onClick={handleQrisSuccess}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
            >
              Simulasikan Pembayaran (Tanpa Uang)
            </button>
            <button type="button" onClick={() => setShowQrisModal(false)} className="mt-3 text-xs text-neutral-400 underline">Batal / Kembali</button>
          </div>
        </div>
      )}

    </div>
  )
}
