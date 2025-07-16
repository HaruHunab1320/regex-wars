import CRTMonitor from '@/components/ui/CRTMonitor'
import Link from 'next/link'

export default function TutorialPage() {
  return (
    <CRTMonitor>
      <main className="flex min-h-screen flex-col items-center justify-start font-mono p-8 overflow-y-auto">
        <div className="max-w-4xl w-full space-y-8">
          <h1 className="text-3xl font-normal text-neon-green text-terminal-glow tracking-wider text-center">
            REGEX TUTORIAL
          </h1>
          
          <section className="space-y-4">
            <h2 className="text-xl text-neon-cyan">BASIC PATTERNS</h2>
            <div className="space-y-2 text-sm text-green-400/80">
              <div className="grid grid-cols-2 gap-4 border border-green-400/20 p-4">
                <div>
                  <code className="text-neon-cyan">a</code>
                  <p className="text-xs mt-1">Matches the letter 'a'</p>
                </div>
                <div>
                  <code className="text-neon-cyan">[abc]</code>
                  <p className="text-xs mt-1">Matches 'a', 'b', or 'c'</p>
                </div>
                <div>
                  <code className="text-neon-cyan">[a-z]</code>
                  <p className="text-xs mt-1">Matches any lowercase letter</p>
                </div>
                <div>
                  <code className="text-neon-cyan">[0-9]</code>
                  <p className="text-xs mt-1">Matches any digit</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl text-neon-cyan">QUANTIFIERS</h2>
            <div className="space-y-2 text-sm text-green-400/80">
              <div className="grid grid-cols-2 gap-4 border border-green-400/20 p-4">
                <div>
                  <code className="text-neon-cyan">a+</code>
                  <p className="text-xs mt-1">One or more 'a'</p>
                </div>
                <div>
                  <code className="text-neon-cyan">a*</code>
                  <p className="text-xs mt-1">Zero or more 'a'</p>
                </div>
                <div>
                  <code className="text-neon-cyan">a?</code>
                  <p className="text-xs mt-1">Zero or one 'a'</p>
                </div>
                <div>
                  <code className="text-neon-cyan">a{"{2,4}"}</code>
                  <p className="text-xs mt-1">Between 2 and 4 'a's</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl text-neon-cyan">SPECIAL CHARACTERS</h2>
            <div className="space-y-2 text-sm text-green-400/80">
              <div className="grid grid-cols-2 gap-4 border border-green-400/20 p-4">
                <div>
                  <code className="text-neon-cyan">.</code>
                  <p className="text-xs mt-1">Any character</p>
                </div>
                <div>
                  <code className="text-neon-cyan">\d</code>
                  <p className="text-xs mt-1">Any digit (same as [0-9])</p>
                </div>
                <div>
                  <code className="text-neon-cyan">\w</code>
                  <p className="text-xs mt-1">Word character [a-zA-Z0-9_]</p>
                </div>
                <div>
                  <code className="text-neon-cyan">\s</code>
                  <p className="text-xs mt-1">Whitespace character</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl text-neon-cyan">GAME STRATEGIES</h2>
            <div className="space-y-3 text-sm text-green-400/80">
              <p>&gt; Start with simple patterns like <code>[a-z]</code> to clear common letters</p>
              <p>&gt; Use <code>.</code> to match any character when you need to clear quickly</p>
              <p>&gt; Combine patterns: <code>[aeiou]+</code> matches groups of vowels</p>
              <p>&gt; Look for patterns in the grid before typing</p>
              <p>&gt; Shorter patterns that match more = higher efficiency score!</p>
            </div>
          </section>

          <div className="pt-8 pb-4 text-center">
            <Link href="/menu">
              <button className="px-6 py-2 border border-green-400/60 text-green-400 hover:bg-green-400/10 hover:border-green-400 transition-all text-sm tracking-wider">
                [ENTER] START PLAYING
              </button>
            </Link>
            <div className="mt-4">
              <Link href="/">
                <button className="text-sm text-green-400/60 hover:text-green-400 transition-all">
                  [ESC] BACK TO MAIN MENU
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </CRTMonitor>
  )
}