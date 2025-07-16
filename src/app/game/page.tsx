'use client'

import { useGameEngine } from '@/hooks/useGameEngine'
import GameGrid from '@/components/game/GameGrid'
import CommandLine from '@/components/commandline/CommandLine'
import BasicHUD from '@/components/hud/BasicHUD'
import CRTMonitor from '@/components/ui/CRTMonitor'
import styles from './game.module.css'

export default function GamePage() {
  const {
    grid,
    gameState,
    matchedPositions,
    patternError,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setPattern,
    executePattern,
  } = useGameEngine()

  const handlePatternSubmit = (pattern: string) => {
    executePattern()
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (gameState.isPlaying && !gameState.isPaused) {
        pauseGame()
      } else if (gameState.isPaused) {
        resumeGame()
      }
    }
  }

  // Add keyboard event listener
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyPress)
  }

  return (
    <CRTMonitor>
      <div className={styles.gameContainer}>
        {/* HUD */}
        <div className={styles.hudSection}>
          <BasicHUD
            score={gameState.score}
            level={gameState.currentLevel}
            linesCleared={gameState.linesCleared}
            timeElapsed={gameState.timeElapsed}
            isPaused={gameState.isPaused}
            isGameOver={gameState.isGameOver}
          />
        </div>

        {/* Main Game Grid */}
        <div className={styles.gridSection}>
          <GameGrid
            grid={grid}
            matchHighlights={matchedPositions}
          />
        </div>

        {/* Command Line */}
        <div className={styles.commandSection}>
          <CommandLine
            onPatternSubmit={handlePatternSubmit}
            onPatternChange={setPattern}
            error={patternError}
            disabled={!gameState.isPlaying || gameState.isPaused}
          />
        </div>

        {/* Game Controls */}
        {!gameState.isPlaying && !gameState.isGameOver && (
          <div className={styles.startScreen}>
            <h2 className={styles.title}>REGEX WARS</h2>
            
            <div className={styles.instructions}>
              <h3 className={styles.instructionsTitle}>HOW TO PLAY</h3>
              <div className={styles.instructionsList}>
                <p>&gt; Characters fall from the top of the grid</p>
                <p>&gt; Type regex patterns to match characters</p>
                <p>&gt; Press ENTER to execute and clear matches</p>
                <p>&gt; Clear lines to increase your score</p>
                <p>&gt; Game ends when characters reach the top</p>
              </div>
              
              <h3 className={styles.instructionsTitle}>EXAMPLE PATTERNS</h3>
              <div className={styles.examplesList}>
                <p><code>[a-z]</code> - Match any lowercase letter</p>
                <p><code>[0-9]+</code> - Match one or more digits</p>
                <p><code>a.*b</code> - Match 'a' followed by anything, then 'b'</p>
              </div>
            </div>
            
            <button 
              className={styles.startButton}
              onClick={startGame}
            >
              START GAME
            </button>
          </div>
        )}

        {gameState.isGameOver && (
          <div className={styles.gameOverScreen}>
            <h2 className={styles.gameOverTitle}>GAME OVER</h2>
            <div className={styles.finalScore}>
              FINAL SCORE: {gameState.score}
            </div>
            <button 
              className={styles.restartButton}
              onClick={resetGame}
            >
              RESTART
            </button>
          </div>
        )}
      </div>
    </CRTMonitor>
  )
}