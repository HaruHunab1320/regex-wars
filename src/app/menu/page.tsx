import CRTMonitor from '@/components/ui/CRTMonitor'
import Link from 'next/link'

export default function MenuPage() {
  return (
    <CRTMonitor>
      <main className="flex min-h-screen flex-col items-center justify-center font-mono">
        <div className="text-center space-y-8 max-w-4xl px-8">
          <h1 className="text-4xl font-normal text-neon-green text-terminal-glow tracking-wider">
            SELECT GAME MODE
          </h1>
          
          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            {/* Campaign Mode */}
            <Link href="/game?mode=campaign">
              <div className="border border-green-400/60 p-6 hover:bg-green-400/10 hover:border-green-400 transition-all cursor-pointer">
                <h2 className="text-xl text-green-400 mb-2">[1] CAMPAIGN MODE</h2>
                <p className="text-sm text-green-400/70">
                  Progressive difficulty with structured learning curve.
                  Master regex patterns from basics to advanced.
                </p>
              </div>
            </Link>
            
            {/* Arena Mode */}
            <div className="border border-gray-600/60 p-6 opacity-50 cursor-not-allowed">
              <h2 className="text-xl text-gray-400 mb-2">[2] ARENA MODE</h2>
              <p className="text-sm text-gray-400/70">
                Real-time PvP battles. Race to clear patterns.
                <span className="block mt-1 text-xs">COMING SOON</span>
              </p>
            </div>
            
            {/* Defense Mode */}
            <div className="border border-gray-600/60 p-6 opacity-50 cursor-not-allowed">
              <h2 className="text-xl text-gray-400 mb-2">[3] DEFENSE MODE</h2>
              <p className="text-sm text-gray-400/70">
                Tower-defense style. Filter incoming threats with regex.
                <span className="block mt-1 text-xs">COMING SOON</span>
              </p>
            </div>
            
            {/* Zen Mode */}
            <Link href="/game?mode=zen">
              <div className="border border-green-400/60 p-6 hover:bg-green-400/10 hover:border-green-400 transition-all cursor-pointer">
                <h2 className="text-xl text-green-400 mb-2">[4] ZEN MODE</h2>
                <p className="text-sm text-green-400/70">
                  Practice mode with no time pressure.
                  Learn and experiment at your own pace.
                </p>
              </div>
            </Link>
          </div>
          
          <div className="pt-6">
            <Link href="/">
              <button className="text-sm text-green-400/60 hover:text-green-400 transition-all">
                [ESC] BACK TO MAIN MENU
              </button>
            </Link>
          </div>
        </div>
      </main>
    </CRTMonitor>
  )
}