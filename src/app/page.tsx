import CRTMonitor from '@/components/ui/CRTMonitor'
import Link from 'next/link'

export default function HomePage() {
  return (
    <CRTMonitor>
      <main className="flex min-h-screen flex-col items-center justify-center font-mono">
        <div className="text-center space-y-6 max-w-4xl px-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-normal text-neon-green text-terminal-glow tracking-wider">
              REGEX WARS
            </h1>
            <div className="text-xs text-green-400/60 tracking-widest">
              v1.0.0 - SYSTEM READY
            </div>
          </div>
          
          <p className="text-base text-green-400/80 tracking-wide">
            &gt; Master the patterns. Conquer the grid.
          </p>
          
          <div className="pt-8">
            <Link href="/terminal">
              <div className="text-base text-green-400 hover:text-green-400/80 transition-all cursor-pointer">
                <span className="animate-pulse">_</span> Press any key to continue...
              </div>
            </Link>
          </div>
          
          <div className="mt-12 space-y-3 text-xs text-green-400/70 text-left max-w-2xl mx-auto">
            <div className="flex items-start gap-2">
              <span className="text-green-400">&gt;</span>
              <div>
                <span className="text-green-400">GAME_MODE_01:</span> Learn regex patterns through progressive gameplay
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">&gt;</span>
              <div>
                <span className="text-green-400">GAME_MODE_02:</span> Real-time pattern matching with visual feedback
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">&gt;</span>
              <div>
                <span className="text-green-400">GAME_MODE_03:</span> Multiplayer arena and leaderboard system
              </div>
            </div>
          </div>
          
          <div className="pt-6 text-xs text-green-400/50">
            <span className="animate-pulse">_</span> Press any key to continue...
          </div>
        </div>
      </main>
    </CRTMonitor>
  )
}