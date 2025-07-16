'use client'

import React, { useState, useEffect, useRef } from 'react'
import CRTMonitor from '@/components/ui/CRTMonitor'
import { useRouter } from 'next/navigation'
import styles from './terminal/terminal.module.css'

interface TerminalLine {
  text: string
  type: 'input' | 'output' | 'system' | 'error'
}

export default function HomePage() {
  const router = useRouter()
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'REGEX WARS v1.0.0', type: 'system' },
    { text: '(c) 2024 CYBERDYNE SYSTEMS', type: 'system' },
    { text: '', type: 'output' },
    { text: 'SYSTEM BOOT SEQUENCE INITIATED...', type: 'system' },
    { text: '', type: 'output' },
    { text: '> Initializing pattern recognition engine...', type: 'output' },
    { text: '> Loading regex compiler...', type: 'output' },
    { text: '> Calibrating display matrix...', type: 'output' },
    { text: '', type: 'output' },
    { text: 'SYSTEM READY', type: 'system' },
    { text: '', type: 'output' },
    { text: 'Welcome to REGEX WARS - Master the patterns. Conquer the grid.', type: 'output' },
    { text: '', type: 'output' },
    { text: 'Press ENTER to continue...', type: 'output' },
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [hasStarted, setHasStarted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasStarted) {
      setHasStarted(true)
      setLines(prev => [
        ...prev,
        { text: '> ', type: 'input' },
        { text: 'ENTERING TERMINAL...', type: 'system' },
      ])
      setTimeout(() => {
        router.push('/terminal')
      }, 1000)
    }
    
    setCurrentInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!hasStarted && e.key !== 'Tab') {
      setHasStarted(true)
      setLines(prev => [
        ...prev,
        { text: '> ', type: 'input' },
        { text: 'ENTERING TERMINAL...', type: 'system' },
      ])
      setTimeout(() => {
        router.push('/terminal')
      }, 1000)
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
            onKeyDown={handleKeyPress}
            className={styles.terminalInput}
            style={{ width: `${Math.max(currentInput.length, 1)}ch` }}
            autoComplete="off"
            spellCheck={false}
            readOnly={!hasStarted}
          />
          <span className={styles.cursor}>_</span>
        </form>
      </div>
    </CRTMonitor>
  )
}