'use client'

import React, { useEffect, useRef, memo } from 'react'
import { GridCell, GridPosition } from '@/game/types'
import styles from './GameGrid.module.css'
import clsx from 'clsx'

interface GameGridProps {
  grid: (GridCell | null)[][]
  matchHighlights: GridPosition[]
  onAnimationComplete?: () => void
}

// Memoized cell component for performance
const GridCellComponent = memo(({ 
  cell, 
  isHighlighted,
  row,
  col 
}: { 
  cell: GridCell | null
  isHighlighted: boolean
  row: number
  col: number
}) => {
  return (
    <div
      className={clsx(
        styles.gridCell,
        isHighlighted && styles.highlighted,
        cell?.isFalling && styles.falling
      )}
      data-row={row}
      data-col={col}
    >
      {cell?.character || ''}
    </div>
  )
})

GridCellComponent.displayName = 'GridCellComponent'

export default function GameGrid({ 
  grid, 
  matchHighlights,
  onAnimationComplete 
}: GameGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Convert match positions to a Set for O(1) lookup
  const highlightSet = new Set(
    matchHighlights.map(pos => `${pos.row},${pos.col}`)
  )

  useEffect(() => {
    if (onAnimationComplete) {
      // Call animation complete after a short delay
      const timer = setTimeout(onAnimationComplete, 300)
      return () => clearTimeout(timer)
    }
  }, [matchHighlights, onAnimationComplete])

  return (
    <div className={styles.gameGridContainer}>
      <div 
        ref={gridRef}
        className={styles.gameGrid}
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length || 20}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`
            const isHighlighted = highlightSet.has(`${rowIndex},${colIndex}`)
            
            return (
              <GridCellComponent
                key={key}
                cell={cell}
                isHighlighted={isHighlighted}
                row={rowIndex}
                col={colIndex}
              />
            )
          })
        )}
      </div>
    </div>
  )
}