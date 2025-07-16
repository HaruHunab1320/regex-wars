'use client'

import React, { useState, useEffect, useCallback } from 'react'
import styles from '@/styles/crt.module.css'
import clsx from 'clsx'
import hackerLabBg from '@/assets/images/hacker-lab.jpg'

interface CRTMonitorProps {
  children: React.ReactNode
  powerOn?: boolean
  enableFlicker?: boolean
  enableScanlines?: boolean
  enableCurvature?: boolean
  enableNoise?: boolean
  enableVignette?: boolean
  enableRGBShift?: boolean
  onPowerToggle?: (isOn: boolean) => void
}

export default function CRTMonitor({
  children,
  powerOn = true,
  enableFlicker = true,
  enableScanlines = true,
  enableCurvature = true,
  enableNoise = true,
  enableVignette = true,
  enableRGBShift = false, // Performance intensive, disabled by default
  onPowerToggle,
}: CRTMonitorProps) {
  const [isPowered, setIsPowered] = useState(powerOn)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsPowered(powerOn)
  }, [powerOn])

  const handlePowerToggle = useCallback(() => {
    setIsAnimating(true)
    const newPowerState = !isPowered
    setIsPowered(newPowerState)
    onPowerToggle?.(newPowerState)

    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 500)
  }, [isPowered, onPowerToggle])

  // Create RGB shift effect using CSS filters
  const rgbShiftStyle = enableRGBShift
    ? {
        filter: `
      drop-shadow(-1px 0 0 rgba(255, 0, 0, 0.5))
      drop-shadow(1px 0 0 rgba(0, 255, 255, 0.5))
    `,
      }
    : {}

  return (
    <div
      className={styles.crtContainer}
      style={{ backgroundImage: `url(${hackerLabBg.src || hackerLabBg})` }}
    >
      <div className={styles.monitorFrame}>
        <div className={styles.screen}>
          {/* Screen curvature effect */}
          {enableCurvature && <div className={styles.screenCurve} />}

          {/* Phosphor glow */}
          <div className={styles.phosphorGlow} />

          {/* Glass bulge effect */}
          {enableCurvature && <div className={styles.glassBulge} />}

          {/* Main content */}
          <div
            className={clsx(
              styles.screenContent,
              enableFlicker && styles.flicker,
              isAnimating && isPowered && styles.turnOn,
              isAnimating && !isPowered && styles.turnOff
            )}
            style={{
              ...rgbShiftStyle,
              opacity: isPowered ? 1 : 0,
              pointerEvents: isPowered ? 'auto' : 'none',
            }}
          >
            {children}
          </div>

          {/* CRT Effects Layers */}
          {isPowered && (
            <>
              {enableScanlines && (
                <>
                  <div className={styles.scanlines} />
                  <div className={styles.scanlineMoving} />
                </>
              )}

              {enableNoise && <div className={styles.noise} />}

              {enableVignette && <div className={styles.vignette} />}

              {/* Screen reflection */}
              <div className={styles.reflection} />
            </>
          )}
        </div>

        {/* Monitor Controls */}
        <div className={styles.monitorControls}>
          <button
            className={clsx(styles.powerButton, isPowered && styles.on)}
            onClick={handlePowerToggle}
            title="Power"
            aria-label="Power button"
          />
          <div className={styles.controlKnob} title="Brightness" />
          <div className={styles.controlKnob} title="Contrast" />
        </div>

        {/* Brand Badge */}
        <div className={styles.brandBadge}>RegexTron 3000</div>
      </div>
    </div>
  )
}
