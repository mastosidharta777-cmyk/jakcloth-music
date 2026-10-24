export default function Home() {
  const mediaPathAudio = "/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp3";
  const mediaPathVideo = "/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp4";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 pb-16 selection:bg-red-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white font-black text-xl px-3 py-1 rounded tracking-tight">
              JAKCLOTH
            </span>
            <span className="font-semibold text-neutral-300 text-sm hidden sm:inline">
              Reload Summerfest 2023
            </span>
          </div>
          <span className="text-xs font-mono bg-neutral-800 text-neutral-400 px-3 py-1 rounded-full border border-neutral-700">
            Live Stream & Player
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-8">
        {/* Banner Section */}
        <section className="bg-gradient-to-r from-red-950/50 via-neutral-900 to-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            JAKCLOTH ARCHIVE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
            For Revenge — Serana
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
            Dokumentasi penampilan langsung RockAroma Jakcloth Reload Summerfest 2023.
          </p>
        </section>

        {/* Video Player */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          <h2 className="text-lg font-bold text-neutral-200 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            Video Live Concert
          </h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-neutral-800 shadow-inner">
            <video
              controls
              src={mediaPathVideo}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Audio Player */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          <h2 className="text-lg font-bold text-neutral-200 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600" />
            Audio Mastering Track
          </h2>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <audio
              controls
              src={mediaPathAudio}
              className="w-full"
            />
          </div>
        </section>
      </div>
    </main>
  );
}