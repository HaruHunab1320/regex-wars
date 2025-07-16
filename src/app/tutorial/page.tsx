'use client'

import React, { useState, useEffect, useRef } from 'react'
import CRTMonitor from '@/components/ui/CRTMonitor'
import { useRouter } from 'next/navigation'
import styles from '../terminal/terminal.module.css'

interface TerminalLine {
  text: string
  type: 'input' | 'output' | 'system' | 'error'
}

export default function TutorialPage() {
  const router = useRouter()
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: 'REGEX TUTORIAL v1.0', type: 'system' },
    { text: '==================', type: 'output' },
    { text: '', type: 'output' },
    { text: 'BASIC PATTERNS:', type: 'system' },
    { text: '  a        - Matches the letter \'a\'', type: 'output' },
    { text: '  [abc]    - Matches \'a\', \'b\', or \'c\'', type: 'output' },
    { text: '  [a-z]    - Matches any lowercase letter', type: 'output' },
    { text: '  [0-9]    - Matches any digit', type: 'output' },
    { text: '', type: 'output' },
    { text: 'QUANTIFIERS:', type: 'system' },
    { text: '  a+       - One or more \'a\'', type: 'output' },
    { text: '  a*       - Zero or more \'a\'', type: 'output' },
    { text: '  a?       - Zero or one \'a\'', type: 'output' },
    { text: '  a{2,4}   - Between 2 and 4 \'a\'s', type: 'output' },
    { text: '', type: 'output' },
    { text: 'SPECIAL CHARACTERS:', type: 'system' },
    { text: '  .        - Any character', type: 'output' },
    { text: '  \\d       - Any digit (same as [0-9])', type: 'output' },
    { text: '  \\w       - Word character [a-zA-Z0-9_]', type: 'output' },
    { text: '  \\s       - Whitespace character', type: 'output' },
    { text: '', type: 'output' },
    { text: 'GAME STRATEGIES:', type: 'system' },
    { text: '  > Start with simple patterns like [a-z] to clear common letters', type: 'output' },
    { text: '  > Use . to match any character when you need to clear quickly', type: 'output' },
    { text: '  > Combine patterns: [aeiou]+ matches groups of vowels', type: 'output' },
    { text: '  > Look for patterns in the grid before typing', type: 'output' },
    { text: '  > Shorter patterns that match more = higher efficiency score!', type: 'output' },
    { text: '', type: 'output' },
    { text: 'Type "exit" to return to terminal', type: 'system' },
  ])
  const [currentInput, setCurrentInput] = useState('')
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
    
    if (currentInput.trim()) {
      const cmd = currentInput.toLowerCase().trim()
      
      setLines(prev => [...prev, { text: `> ${currentInput}`, type: 'input' }])
      
      if (cmd === 'exit') {
        setLines(prev => [...prev, { text: 'Returning to terminal...', type: 'system' }])
        setTimeout(() => router.push('/terminal'), 500)
      } else {
        setLines(prev => [...prev, { text: `Unknown command: ${cmd}`, type: 'error' }])
      }
      
      setCurrentInput('')
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