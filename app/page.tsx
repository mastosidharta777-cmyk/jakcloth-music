export default function Home() {
  return (
    <main className="min-h-screen p-6 bg-black text-white max-w-3xl mx-auto flex flex-col items-center justify-center">
      <h1 className="text-3xl font-extrabold mb-8 text-red-600">
        JakCloth Music Player
      </h1>

      <div className="w-full space-y-8 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
        {/* Player Audio */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-zinc-200">
            Audio Live - For Revenge (Serana)
          </h2>
          <audio 
            controls 
            src="/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp3" 
            className="w-full"
          />
        </div>

        {/* Player Video */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-zinc-200">
            Video Live - For Revenge (Serana)
          </h2>
          <video 
            controls 
            src="/media/for Revenge - Serana Live at RockAroma Jakcloth Reload Summerfest 2023.mp4" 
            className="w-full rounded-xl border border-zinc-700"
          />
        </div>
      </div>
    </main>
  );
}