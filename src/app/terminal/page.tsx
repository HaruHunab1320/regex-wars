'use client'

import React, { useState, useEffect, useRef } from 'react'
import CRTMonitor from '@/components/ui/CRTMonitor'
import { useRouter } from 'next/navigation'
import styles from './terminal.module.css'

interface TerminalLine {
  text: string
  type: 'input' | 'output' | 'system' | 'error'
}

export default function TerminalPage() {
  const router = useRouter()
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'REGEX WARS v1.0.0', type: 'system' },
    { text: '(c) 2024 CYBERDYNE SYSTEMS', type: 'system' },
    { text: '', type: 'output' },
    { text: '██████╗ ███████╗ ██████╗ ███████╗██╗  ██╗    ██╗    ██╗ █████╗ ██████╗ ███████╗', type: 'system' },
    { text: '██╔══██╗██╔════╝██╔════╝ ██╔════╝╚██╗██╔╝    ██║    ██║██╔══██╗██╔══██╗██╔════╝', type: 'system' },
    { text: '██████╔╝█████╗  ██║  ███╗█████╗   ╚███╔╝     ██║ █╗ ██║███████║██████╔╝███████╗', type: 'system' },
    { text: '██╔══██╗██╔══╝  ██║   ██║██╔══╝   ██╔██╗     ██║███╗██║██╔══██║██╔══██╗╚════██║', type: 'system' },
    { text: '██║  ██║███████╗╚██████╔╝███████╗██╔╝ ██╗    ╚███╔███╔╝██║  ██║██║  ██║███████║', type: 'system' },
    { text: '╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝', type: 'system' },
    { text: '', type: 'output' },
    { text: 'Master the patterns. Conquer the grid.', type: 'output' },
    { text: '', type: 'output' },
    { text: 'AVAILABLE GAME MODES:', type: 'system' },
    { text: '  [1] CAMPAIGN  - Progressive difficulty with structured learning', type: 'output' },
    { text: '  [2] ZEN       - Practice mode with no time pressure', type: 'output' },
    { text: '  [3] ARENA     - Real-time PvP battles (COMING SOON)', type: 'output' },
    { text: '  [4] DEFENSE   - Tower-defense style gameplay (COMING SOON)', type: 'output' },
    { text: '', type: 'output' },
    { text: 'Type "help" for available commands', type: 'output' },
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
    // Scroll to bottom when new lines are added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const processCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    const args = cmd.split(' ')
    const mainCmd = args[0]

    switch (mainCmd) {
      case 'help':
        return [
          { text: 'AVAILABLE COMMANDS:', type: 'system' as const },
          { text: '  play [mode]  - Start game (campaign/zen)', type: 'output' as const },
          { text: '  tutorial     - View regex tutorial', type: 'output' as const },
          { text: '  stats        - View player statistics', type: 'output' as const },
          { text: '  settings     - Configure game settings', type: 'output' as const },
          { text: '  clear        - Clear terminal', type: 'output' as const },
          { text: '  exit         - Return to main menu', type: 'output' as const },
        ]

      case 'play':
        const mode = args[1] || 'campaign'
        if (['campaign', 'zen'].includes(mode)) {
          setTimeout(() => router.push(`/game-terminal?mode=${mode}`), 500)
          return [
            { text: `INITIALIZING ${mode.toUpperCase()} MODE...`, type: 'system' as const },
            { text: 'Loading game assets...', type: 'output' as const },
          ]
        } else {
          return [
            { text: `ERROR: Unknown game mode "${mode}"`, type: 'error' as const },
            { text: 'Available modes: campaign, zen', type: 'output' as const },
          ]
        }

      case 'tutorial':
        setTimeout(() => router.push('/tutorial'), 500)
        return [
          { text: 'LOADING TUTORIAL...', type: 'system' as const },
        ]

      case 'stats':
        return [
          { text: 'PLAYER STATISTICS:', type: 'system' as const },
          { text: '  Games Played: 0', type: 'output' as const },
          { text: '  High Score: 0', type: 'output' as const },
          { text: '  Patterns Mastered: 0', type: 'output' as const },
          { text: '  Total Lines Cleared: 0', type: 'output' as const },
        ]

      case 'settings':
        return [
          { text: 'GAME SETTINGS:', type: 'system' as const },
          { text: '  Sound: ON', type: 'output' as const },
          { text: '  Difficulty: NORMAL', type: 'output' as const },
          { text: '  CRT Effects: ON', type: 'output' as const },
          { text: '  (Settings can be modified in-game)', type: 'output' as const },
        ]

      case 'clear':
        setLines([])
        return []

      case 'exit':
        setTimeout(() => router.push('/'), 500)
        return [
          { text: 'SHUTTING DOWN...', type: 'system' as const },
        ]

      default:
        if (cmd) {
          return [
            { text: `Command not found: ${mainCmd}`, type: 'error' as const },
            { text: 'Type "help" for available commands', type: 'output' as const },
          ]
        }
        return []
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentInput.trim()) {
      // Add command to history
      setCommandHistory([...commandHistory, currentInput])
      setHistoryIndex(-1)

      // Add input line to terminal
      const newLines = [...lines, { text: `> ${currentInput}`, type: 'input' as const }]
      
      // Process command and add output
      const output = processCommand(currentInput)
      setLines([...newLines, ...output])
      
      // Clear input
      setCurrentInput('')
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

  return (
    <CRTMonitor>
      <div className={styles.terminalContainer}>
        <div ref={terminalRef} className={styles.terminalOutput}>
          {lines.map((line, index) => (
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
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.terminalInput}
            style={{ width: `${Math.max(currentInput.length, 1)}ch` }}
            autoComplete="off"
            spellCheck={false}
          />
          <span className={styles.cursor}>_</span>
        </form>
      </div>
    </CRTMonitor>
  )
}