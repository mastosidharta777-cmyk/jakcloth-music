'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
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

interface Stage {
  id: string
  name: string
  currentBand: string
  votes: number
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
  const [loading, setLoading] = useState(true)
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('video')
  const [isLocked, setIsLocked] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isUnlockedByDemo, setIsUnlockedByDemo] = useState(false)
  const [showQrisModal, setShowQrisModal] = useState(false)
  const [selectedPaymentItem, setSelectedPaymentItem] = useState<{ name: string; price: string } | null>(null)
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

  const [stages, setStages] = useState<Stage[]>([
    { id: '1', name: 'Main Stage', currentBand: 'For Revenge', votes: 1420 },
    { id: '2', name: 'Indie Stage A', currentBand: 'The Overdue (Band Pembuka)', votes: 890 },
    { id: '3', name: 'Indie Stage B', currentBand: 'Rhythm Section', votes: 610 }
  ])
  const [hasVoted, setHasVoted] = useState<string | null>(null)

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
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [stagesRes] = await Promise.all([
        supabase.from('stages').select('*')
      ])
      if (stagesRes.data && stagesRes.data.length > 0) setStages(stagesRes.data)
    } catch (err) {
      console.log('Menggunakan data lokal:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleVote(stageId: string) {
    if (hasVoted) return
    setHasVoted(stageId)
    const stage = stages.find((s) => s.id === stageId)
    const newVotes = (stage?.votes || 0) + 1
    setStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, votes: newVotes } : s))
    )
    await supabase.from('stages').update({ votes: newVotes }).eq('id', stageId)
  }

  const handleUnlockDemo = () => {
    setIsLocked(false)
    setIsUnlockedByDemo(true)
    setShowPaymentModal(false)
    setShowQrisModal(false)
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.play()
    }
    if (mediaType === 'audio' && audioRef.current) {
      audioRef.current.play()
    }
  }

  const handleQrisSuccess = () => {
    setShowQrisModal(false)
    setIsLocked(false)
    setIsUnlockedByDemo(true)
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.play()
    }
    if (mediaType === 'audio' && audioRef.current) {
      audioRef.current.play()
    }
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setIsLocked(false)
    setIsUnlockedByDemo(true)
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.play()
    }
    if (mediaType === 'audio' && audioRef.current) {
      audioRef.current.play()
    }
  }

  const handleClaimMerch = async (item: Merchandise) => {
    if (item.claimed >= item.stock) return
    const newClaimed = item.claimed + 1
    setMerchList((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, claimed: newClaimed } : m))
    )
    setActiveQR({ code: item.code, title: item.title, brand: item.brand })
    try {
      await supabase.from('vouchers').update({ claimed_count: newClaimed }).eq('id', item.id)
    } catch {}
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement | HTMLAudioElement>) => {
    const target = e.currentTarget
    if (!isUnlockedByDemo && target.currentTime >= 15 && !isLocked) {
      target.pause()
      setIsLocked(true)
    }
  }

  const handleBuyDigitalPass = () => {
    setSelectedPaymentItem({ name: 'Digital Master Pass', price: 'Rp 25.000' })
    setIsLocked(false)
    setShowPaymentModal(false)
    setShowQrisModal(true)
  }

  const handleBuyMerchFromPaywall = () => {
    setSelectedPaymentItem({ name: 'Merchandise Official Bundle', price: 'Mulai Rp 75.000' })
    setIsLocked(false)
    setShowPaymentModal(false)
    setShowQrisModal(true)
  }

  const handleBuyDigitalAlbum = () => {
    setSelectedPaymentItem({ name: 'Digital Album', price: 'Rp 25.000' })
    setIsLocked(false)
    setShowPaymentModal(false)
    setShowQrisModal(true)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
          <span>Memuat Media & Katalog Merchandise...</span>
        </div>
      </main>
    )
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

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-8">
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center flex-wrap gap-2">
            <div>
              <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">Featured Performance</span>
              <h2 className="text-xl font-bold">{activeTrack.artist} — {activeTrack.title}</h2>
            </div>
            <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setMediaType('video')}
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
            {mediaType === 'video' ? (
              <video
                ref={videoRef}
                key={activeTrack.videoUrl || activeTrack.id}
                controls
                controlsList="nodownload"
                className="w-full aspect-video rounded-b-xl"
                poster="/media/For Revenge Rockaroma Live Performance.png"
                onTimeUpdate={handleTimeUpdate}
              >
                <source src={activeTrack.videoUrl || "/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp4"} type="video/mp4" />
                Browser Anda tidak mendukung HTML5 video.
              </video>
            ) : (
              <div className="w-full p-8 flex flex-col items-center justify-center text-center bg-neutral-950">
                <span className="text-xs font-mono text-red-400 mb-2">High Quality Audio Stream</span>
                <p className="font-bold text-lg text-white mb-4">{activeTrack.title} — <span className="text-neutral-400">{activeTrack.artist}</span></p>
                <audio ref={audioRef} key={activeTrack.audioUrl} controls src={activeTrack.audioUrl} className="w-full max-w-md" onTimeUpdate={handleTimeUpdate}>
                  Browser Anda tidak mendukung HTML5 audio.
                </audio>
              </div>
            )}
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Kompilasi Album JakCloth</h3>
            <p className="text-xs text-neutral-400">Pilih artwork album untuk melihat daftar lagu</p>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => setSelectedAlbum(album.id === selectedAlbum ? null : album.id)}
                className={`min-w-[260px] md:min-w-0 cursor-pointer rounded-lg border overflow-hidden transition ${
                  selectedAlbum === album.id ? 'border-red-600' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <img src={album.cover} alt={album.name} className="w-full h-40 md:h-48 object-cover" />
                <div className="p-3 bg-neutral-950">
                  <p className="text-sm font-bold text-white">{album.name}</p>
                  <p className="text-xs text-neutral-400">{album.genre}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBuyDigitalAlbum()
                    }}
                    className="mt-2 w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition"
                  >
                    Beli Digital Album (Rp 25.000)
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
                        <img src={album.cover} alt={album.name} className="w-16 h-16 rounded object-cover" />
                        <div>
                          <p className="font-bold text-white">{album.name}</p>
                          <p className="text-xs text-neutral-400">{album.genre}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {albumTracks.map((track, idx) => (
                          <div
                            key={track.id}
                            onClick={() => {
                              setIsLocked(false)
                              if (track.audioUrl) {
                                setActiveTrack(track)
                                setMediaType('audio')
                              }
                            }}
                            className={`p-3 rounded-lg border flex items-center justify-between transition ${
                              track.audioUrl
                                ? 'cursor-pointer bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                                : 'bg-neutral-950/50 border-neutral-800/50 cursor-default'
                            } ${
                              activeTrack.id === track.id && track.audioUrl ? 'bg-red-950/40 border-red-600/50' : ''
                            }`}
                          >
                            <div>
                              <p className="text-sm font-semibold text-white">{idx + 1}. {track.title}</p>
                              <p className="text-xs text-neutral-400">{track.artist}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-neutral-500 font-mono">{track.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Merchandise Cross-Reward Demo</h3>
            <p className="text-xs text-emerald-400">Beli Merch = Bonus Gratis Digital Master Audio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {merchandise.map((item: any) => (
              <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-red-600 text-white px-2 py-1 rounded">{item.badge}</span>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                  <p className="text-sm font-bold text-red-400 mt-1">{item.price}</p>
                  <button onClick={handleBuyDigitalAlbum} className="mt-auto w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition">
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
            <p className="text-xs text-neutral-400">Klaim voucher diskon eksklusif dan tukarkan QR Code langsung di booth brand</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {merchList.map((item) => {
              const isSoldOut = item.claimed >= item.stock
              return (
                <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 flex gap-3 items-center">
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md bg-neutral-900" />
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
              <span className="text-xs font-semibold text-emerald-400 mb-1">✓ Voucher Merchandise Berhasil Diklaim</span>
              <p className="text-xs text-neutral-400 font-mono mb-1">{activeQR.brand}</p>
              <p className="text-sm font-bold text-white mb-3">{activeQR.title}</p>
              <div className="p-3 bg-white rounded-lg">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(activeQR.code)}`} alt="Voucher QR Code" className="w-40 h-40" />
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-3">Kode Verifikasi Kasir: <span className="text-white font-bold">{activeQR.code}</span></p>
              <button onClick={() => setActiveQR(null)} className="mt-3 text-xs text-neutral-500 hover:text-white underline">Tutup QR Code</button>
            </div>
          )}
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Stage Crowd Voting</h3>
            <p className="text-xs text-neutral-400">Vote panggung terfavorit sekarang (1 device = 1 vote)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stages.map((stage) => (
              <div key={stage.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-mono">{stage.name}</span>
                  <h4 className="font-bold text-white text-base mt-1">{stage.currentBand}</h4>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-red-400">{stage.votes?.toLocaleString()} Votes</span>
                  <button
                    onClick={() => handleVote(stage.id)}
                    disabled={hasVoted !== null}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                      hasVoted === stage.id
                        ? 'bg-emerald-600 text-white'
                        : hasVoted !== null
                        ? 'bg-neutral-800 text-neutral-500'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {hasVoted === stage.id ? 'Voted' : 'Vote'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showQrisModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-1">Pembayaran QRIS / Mayar Demo</h3>
              <p className="text-sm text-neutral-400">Selesaikan pembayaran untuk membuka akses penuh</p>
            </div>
            <div className="mb-4 p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
              <p className="text-sm font-semibold text-white">{selectedPaymentItem?.name}</p>
              <p className="text-lg font-bold text-red-400 mt-1">{selectedPaymentItem?.price}</p>
            </div>
            <div className="mb-4 flex flex-col items-center">
              <div className="p-4 bg-white rounded-lg">
                <svg width="160" height="160" viewBox="0 0 160 160" className="w-40 h-40">
                  <rect width="160" height="160" fill="white" />
                  <rect x="10" y="10" width="30" height="30" fill="black" />
                  <rect x="120" y="10" width="30" height="30" fill="black" />
                  <rect x="10" y="120" width="30" height="30" fill="black" />
                  <rect x="50" y="50" width="60" height="60" fill="black" />
                </svg>
              </div>
              <p className="text-xs text-neutral-400 mt-3">Scan dengan E-Wallet / Mobile Banking</p>
            </div>
            <button
              onClick={handleQrisSuccess}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
            >
              Simulasi Pembayaran Berhasil
            </button>
          </div>
        </div>
      )}

      {isLocked && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-1">Akses Terkunci - Pilih Opsi Pembelian</h3>
              <p className="text-sm text-neutral-400">
                Anda telah mendengarkan 15 detik preview. Pilih opsi untuk membuka akses penuh.
              </p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg">
                <p className="text-sm font-semibold text-white mb-1">Opsi 1 (Digital Pass Only)</p>
                <p className="text-xs text-neutral-400 mb-3">Beli Digital Master Pass (Rp 25.000)</p>
                <button
                  onClick={handleBuyDigitalPass}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition"
                >
                  Beli Pass Digital & Unlock
                </button>
              </div>

              <div className="p-4 bg-neutral-950 border border-emerald-700/50 rounded-lg">
                <p className="text-sm font-semibold text-white mb-1">Opsi 2 (Merch Bundle)</p>
                <p className="text-xs text-neutral-400 mb-3">Beli Merchandise Official (Mulai Rp 75.000)</p>
            <button
              onClick={handleQrisSuccess}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
            >
              Lanjutkan Pemutaran
            </button>
              </div>
            </div>

            <button
              onClick={handleUnlockDemo}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition"
            >
              Simulasi Unlock Demo (Free Access)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
