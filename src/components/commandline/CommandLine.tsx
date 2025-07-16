'use client'

import React, { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react'
import styles from './CommandLine.module.css'
import clsx from 'clsx'

interface CommandLineProps {
  onPatternSubmit: (pattern: string) => void
  onPatternChange: (pattern: string) => void
  error?: string | null
  disabled?: boolean
}

export default function CommandLine({
  onPatternSubmit,
  onPatternChange,
  error,
  disabled = false,
}: CommandLineProps) {
  const [pattern, setPattern] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (pattern.trim() && !disabled) {
      // Add to history
      setHistory(prev => [...prev, pattern])
      setHistoryIndex(-1)
      
      // Submit pattern
      onPatternSubmit(pattern)
      
      // Clear input
      setPattern('')
    }
  }

  const handleChange = (value: string) => {
    setPattern(value)
    onPatternChange(value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 
          ? historyIndex + 1 
          : history.length - 1
        setHistoryIndex(newIndex)
        const historicalPattern = history[history.length - 1 - newIndex]
        setPattern(historicalPattern)
        onPatternChange(historicalPattern)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        const historicalPattern = history[history.length - 1 - newIndex]
        setPattern(historicalPattern)
        onPatternChange(historicalPattern)
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setPattern('')
        onPatternChange('')
      }
    }
  }

  return (
    <div className={styles.commandLineContainer}>
      <form onSubmit={handleSubmit} className={styles.commandLineForm}>
        <div className={styles.inputWrapper}>
          <span className={styles.prompt}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={pattern}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={clsx(
              styles.input,
              error && styles.hasError
            )}
            placeholder="Enter regex pattern..."
            disabled={disabled}
            autoComplete="off"
            spellCheck={false}
          />
          <span className={styles.cursor} />
        </div>
        
        {error && (
          <div className={styles.error}>
            <span className={styles.errorPrefix}>ERROR:</span> {error}
          </div>
        )}
        
        <div className={styles.hints}>
          <span className={styles.hint}>[ENTER] Execute</span>
          <span className={styles.hint}>[↑/↓] History</span>
          <span className={styles.hint}>[ESC] Clear</span>
        </div>
      </form>
      
      <div className={styles.patternPreview}>
        {pattern && (
          <>
            <span className={styles.previewLabel}>PATTERN:</span>
            <code className={styles.previewPattern}>/{pattern}/g</code>
          </>
        )}
      </div>
    </div>
  )
}