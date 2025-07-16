'use client'

import React from 'react'
import styles from './BasicHUD.module.css'

interface BasicHUDProps {
  score: number
  level: number
  linesCleared: number
  timeElapsed: number
  isPaused: boolean
  isGameOver: boolean
}

export default function BasicHUD({
  score,
  level,
  linesCleared,
  timeElapsed,
  isPaused,
  isGameOver,
}: BasicHUDProps) {
  // Format time as MM:SS
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <div className={styles.hudContainer}>
      <div className={styles.hudSection}>
        <div className={styles.hudItem}>
          <span className={styles.label}>SCORE</span>
          <span className={styles.value}>{score.toLocaleString()}</span>
        </div>
        
        <div className={styles.hudItem}>
          <span className={styles.label}>LEVEL</span>
          <span className={styles.value}>{level}</span>
        </div>
        
        <div className={styles.hudItem}>
          <span className={styles.label}>LINES</span>
          <span className={styles.value}>{linesCleared}</span>
        </div>
        
        <div className={styles.hudItem}>
          <span className={styles.label}>TIME</span>
          <span className={styles.value}>{formatTime(timeElapsed)}</span>
        </div>
      </div>
      
      {isPaused && !isGameOver && (
        <div className={styles.statusMessage}>
          <span className={styles.pausedText}>PAUSED</span>
        </div>
      )}
      
      {isGameOver && (
        <div className={styles.statusMessage}>
          <span className={styles.gameOverText}>GAME OVER</span>
        </div>
      )}
    </div>
  )
}