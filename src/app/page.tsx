import CRTMonitor from '@/components/ui/CRTMonitor'

export default function HomePage() {
  return (
    <CRTMonitor>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center space-y-8 max-w-4xl px-8">
          <h1 className="text-6xl font-bold text-neon-green text-neon-glow">
            REGEX WARS
          </h1>
          
          <p className="text-xl text-cyber-gray-300">
            Master the patterns. Conquer the grid.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button className="btn-cyber text-neon-cyan">
              Start Game
            </button>
            <button className="btn-cyber text-neon-pink">
              Tutorial
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-8 text-sm">
            <div className="text-center">
              <div className="text-4xl mb-2">🎮</div>
              <h3 className="text-neon-cyan mb-1">Learn by Playing</h3>
              <p className="text-cyber-gray-400">
                Master regex through addictive gameplay
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="text-neon-green mb-1">Real-time Matching</h3>
              <p className="text-cyber-gray-400">
                See your patterns come to life instantly
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="text-neon-pink mb-1">Compete & Progress</h3>
              <p className="text-cyber-gray-400">
                Challenge others and track your mastery
              </p>
            </div>
          </div>
        </div>
      </main>
    </CRTMonitor>
  )
}