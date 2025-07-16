'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useGameEngine } from '@/hooks/useGameEngine'
import GameGrid from '@/components/game/GameGrid'
import BasicHUD from '@/components/hud/BasicHUD'
import CRTMonitor from '@/components/ui/CRTMonitor'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './game-terminal.module.css'

interface TerminalLine {
  text: string
  type: 'input' | 'output' | 'system' | 'error' | 'success'
}

export default function GameTerminalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'campaign'
  
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

  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: `REGEX WARS - ${mode.toUpperCase()} MODE`, type: 'system' },
    { text: 'Loading game environment...', type: 'output' },
    { text: 'Grid initialized [20x30]', type: 'output' },
    { text: 'Pattern matcher ready', type: 'output' },
    { text: '', type: 'output' },
    { text: 'Type "start" to begin', type: 'system' },
    { text: 'Type "help" for commands', type: 'output' },
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  const addLine = useCallback((text: string, type: TerminalLine['type']) => {
    setTerminalLines(prev => [...prev, { text, type }])
  }, [])

  const processCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase().trim()
    
    // Game state commands
    if (!gameState.isPlaying && !gameState.isGameOver) {
      switch (cmd) {
        case 'start':
          startGame()
          addLine('GAME STARTED', 'system')
          addLine('Characters will begin falling...', 'output')
          addLine('Enter regex patterns to match and clear them', 'output')
          break
        
        case 'help':
          addLine('AVAILABLE COMMANDS:', 'system')
          addLine('  start - Begin the game', 'output')
          addLine('  exit  - Return to terminal', 'output')
          break
        
        case 'exit':
          router.push('/terminal')
          break
        
        default:
          if (cmd) {
            addLine(`Unknown command: ${cmd}`, 'error')
          }
      }
    } else if (gameState.isGameOver) {
      switch (cmd) {
        case 'restart':
          resetGame()
          addLine('GAME RESET', 'system')
          addLine('Type "start" to play again', 'output')
          break
        
        case 'exit':
          router.push('/terminal')
          break
        
        default:
          if (cmd) {
            addLine('Game Over. Type "restart" or "exit"', 'error')
          }
      }
    } else if (gameState.isPlaying) {
      // During gameplay, treat input as regex patterns
      switch (cmd) {
        case 'pause':
          pauseGame()
          addLine('GAME PAUSED', 'system')
          break
        
        case 'resume':
          resumeGame()
          addLine('GAME RESUMED', 'system')
          break
        
        case 'help':
          addLine('GAME COMMANDS:', 'system')
          addLine('  pause/resume - Control game state', 'output')
          addLine('  exit - Quit to terminal', 'output')
          addLine('  Any other text is treated as a regex pattern', 'output')
          break
        
        case 'exit':
          pauseGame()
          router.push('/terminal')
          break
        
        default:
          if (cmd) {
            // Treat as regex pattern
            const currentMatches = matchedPositions.length
            executePattern()
            
            if (patternError) {
              addLine(`REGEX ERROR: ${patternError}`, 'error')
            } else if (currentMatches > 0) {
              addLine(`PATTERN EXECUTED: /${cmd}/`, 'success')
              addLine(`Cleared ${currentMatches} characters`, 'output')
            } else {
              addLine(`NO MATCHES: /${cmd}/`, 'output')
            }
          }
      }
    }
  }, [gameState, startGame, pauseGame, resumeGame, resetGame, executePattern, patternError, matchedPositions, router, addLine])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentInput.trim()) {
      setCommandHistory([...commandHistory, currentInput])
      setHistoryIndex(-1)
      
      addLine(`> ${currentInput}`, 'input')
      
      // During gameplay, set pattern for real-time preview
      if (gameState.isPlaying && !['pause', 'resume', 'help', 'exit'].includes(currentInput.toLowerCase().trim())) {
        setPattern(currentInput)
      }
      
      processCommand(currentInput)
      setCurrentInput('')
    }
  }

  const handleInputChange = (value: string) => {
    setCurrentInput(value)
    
    // Real-time pattern preview during gameplay
    if (gameState.isPlaying && !gameState.isPaused) {
      setPattern(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    }
  }

  // Add game state changes to terminal
  useEffect(() => {
    if (gameState.isGameOver) {
      addLine('GAME OVER', 'error')
      addLine(`Final Score: ${gameState.score}`, 'system')
      addLine('Type "restart" to play again or "exit" to quit', 'output')
    }
  }, [gameState.isGameOver, gameState.score, addLine])

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

        {/* Game Grid */}
        <div className={styles.gridSection}>
          <GameGrid
            grid={grid}
            matchHighlights={matchedPositions}
          />
        </div>

        {/* Terminal */}
        <div className={styles.terminalSection}>
          <div ref={terminalRef} className={styles.terminalOutput}>
            {terminalLines.map((line, index) => (
              <div
                key={index}
                className={`${styles.terminalLine} ${styles[line.type]}`}
              >
                {line.text}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className={styles.terminalInputForm}>
            <span className={styles.prompt}>&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.terminalInput}
              placeholder={gameState.isPlaying ? "Enter regex pattern..." : "Type 'start' to begin"}
              autoComplete="off"
              spellCheck={false}
            />
            <span className={styles.cursor}>_</span>
          </form>
        </div>
      </div>
    </CRTMonitor>
  )
}