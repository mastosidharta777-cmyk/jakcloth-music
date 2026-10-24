'use client';

export default function Home() {
  const activeTrack = {
    title: "Serana (Live at RockAroma)",
    artist: "For Revenge",
    event: "JakCloth Reload Summerfest 2023",
    audioSrc: "/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp3",
    videoSrc: "/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp4",
  };

  const lineup = [
    { id: 1, title: "Serana (Live)", artist: "For Revenge", duration: "05:48", active: true },
    { id: 2, title: "Jakarta Hari Ini", artist: "For Revenge", duration: "04:12", active: false },
    { id: 3, title: "Penyebab Terbesar", artist: "For Revenge", duration: "03:55", active: false },
    { id: 4, title: "Berani Beda (Live)", artist: "JakCloth All Stars", duration: "04:30", active: false },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-neutral-900/80 border-r border-neutral-800 flex flex-col justify-between p-4 hidden md:flex">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="bg-red-600 text-white font-black px-2.5 py-1 rounded text-lg tracking-wider">
              JAKCLOTH
            </div>
            <span className="text-xs font-bold tracking-widest text-neutral-400">MUSIC APP</span>
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-600/10 text-red-500 font-semibold text-sm">
              <span>🔥</span> Main Stage Live
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white font-medium text-sm transition">
              <span>🎤</span> Artist Lineup
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white font-medium text-sm transition">
              <span>📼</span> Concert Vault
            </a>
          </nav>
        </div>

        <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/50 text-xs">
          <p className="text-neutral-300 font-semibold">JakCloth Summerfest 2023</p>
          <p className="text-neutral-500 mt-0.5">RockAroma Showcase Stage</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top App Header */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-900/40 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 w-1/3">
            <input 
              type="text" 
              placeholder="Cari lagu, band, atau panggung..." 
              className="w-full bg-neutral-800 border border-neutral-700 text-xs text-white rounded-full px-4 py-2 focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-red-500 font-bold bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full animate-pulse">
              ● LIVE STREAMING
            </span>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">
              JK
            </div>
          </div>
        </header>

        {/* Main Dashboard Layout */}
        <div className="p-6 space-y-8 max-w-6xl mx-auto w-full pb-20">
          {/* Main Stage Showcase Video */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
              <div>
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Showcase Stage</span>
                <h1 className="text-xl font-bold text-white">{activeTrack.artist} — {activeTrack.title}</h1>
              </div>
              <span className="text-xs text-neutral-400 font-mono bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">
                {activeTrack.event}
              </span>
            </div>
            
            <div className="aspect-video w-full bg-black relative">
              <video 
                controls 
                src={activeTrack.videoSrc} 
                className="w-full h-full object-contain"
              />
            </div>
          </section>

          {/* Grid Section: Audio Track & Catalog */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audio Mastering Box & Catalog List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  Mastering Audio Track
                </h2>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <audio controls src={activeTrack.audioSrc} className="w-full" />
                </div>
              </div>

              {/* Setlist Catalog */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-base font-bold text-white mb-4">RockAroma Stage Catalog</h2>
                <div className="space-y-2">
                  {lineup.map((item) => (
                    <div 
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition ${
                        item.active 
                          ? 'bg-red-600/10 border-red-500/30 text-white' 
                          : 'bg-neutral-950/50 border-neutral-800/80 text-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${item.active ? 'text-red-500' : 'text-neutral-500'}`}>
                          0{item.id}
                        </span>
                        <div>
                          <p className={`text-sm font-semibold ${item.active ? 'text-white' : 'text-neutral-200'}`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-neutral-500">{item.artist}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-neutral-500">{item.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Event Info */}
            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Event Details</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-neutral-500">Festival</p>
                    <p className="text-neutral-200 font-semibold">RockAroma JakCloth Reload Summerfest</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Stage</p>
                    <p className="text-neutral-200 font-semibold">Main Showcase Stage</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Location & Year</p>
                    <p className="text-neutral-200 font-semibold">Jakarta, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}