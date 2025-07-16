'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { GridManager } from '@/game/core/GridManager'
import { PatternMatcher } from '@/game/core/PatternMatcher'
import { CharacterGenerator } from '@/game/core/CharacterGenerator'
import { GameStateManager } from '@/game/core/GameStateManager'
import { GameLoop } from '@/game/core/GameLoop'
import { gameEventManager } from '@/game/core/EventManager'
import { GridCell, GridPosition, GameState } from '@/game/types'

interface UseGameEngineReturn {
  // Game state
  grid: (GridCell | null)[][]
  gameState: GameState
  matchedPositions: GridPosition[]
  patternError: string | null
  
  // Game controls
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  resetGame: () => void
  
  // Pattern controls
  setPattern: (pattern: string) => void
  executePattern: () => void
}

export function useGameEngine(): UseGameEngineReturn {
  // Initialize game components
  const gridManagerRef = useRef<GridManager | null>(null)
  const patternMatcherRef = useRef<PatternMatcher | null>(null)
  const characterGeneratorRef = useRef<CharacterGenerator | null>(null)
  const gameStateManagerRef = useRef<GameStateManager | null>(null)
  const gameLoopRef = useRef<GameLoop | null>(null)

  // React state
  const [grid, setGrid] = useState<(GridCell | null)[][]>([])
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    currentLevel: 1,
    score: 0,
    linesCleared: 0,
    currentPattern: '',
    fallSpeed: 1000,
    timeElapsed: 0,
  })
  const [matchedPositions, setMatchedPositions] = useState<GridPosition[]>([])
  const [patternError, setPatternError] = useState<string | null>(null)

  // Initialize game engine
  useEffect(() => {
    // Create game components
    const gridManager = new GridManager(20, 30)
    const patternMatcher = new PatternMatcher()
    const characterGenerator = new CharacterGenerator()
    const gameStateManager = new GameStateManager()
    const gameLoop = new GameLoop(
      gridManager,
      patternMatcher,
      characterGenerator,
      gameStateManager
    )

    // Store refs
    gridManagerRef.current = gridManager
    patternMatcherRef.current = patternMatcher
    characterGeneratorRef.current = characterGenerator
    gameStateManagerRef.current = gameStateManager
    gameLoopRef.current = gameLoop

    // Set initial grid
    setGrid(gridManager.getGridState())

    // Subscribe to events
    const unsubscribeGrid = gameEventManager.subscribe('GRID_UPDATED', (event) => {
      setGrid(event.payload.grid)
    })

    const unsubscribeMatch = gameEventManager.subscribe('MATCH_FOUND', (event) => {
      setMatchedPositions(event.payload.positions || [])
    })

    const unsubscribePattern = gameEventManager.subscribe('PATTERN_CHANGED', (event) => {
      if (!event.payload.isValid) {
        setPatternError(event.payload.error)
      } else {
        setPatternError(null)
      }
    })

    const unsubscribeState = gameStateManager.subscribe('stateChange', (state) => {
      setGameState(state)
    })

    // Cleanup
    return () => {
      gameLoop.stop()
      unsubscribeGrid()
      unsubscribeMatch()
      unsubscribePattern()
      unsubscribeState()
    }
  }, [])

  // Game control functions
  const startGame = useCallback(() => {
    gameLoopRef.current?.start()
  }, [])

  const pauseGame = useCallback(() => {
    gameLoopRef.current?.pause()
  }, [])

  const resumeGame = useCallback(() => {
    gameLoopRef.current?.resume()
  }, [])

  const resetGame = useCallback(() => {
    gameLoopRef.current?.reset()
    setGrid(gridManagerRef.current?.getGridState() || [])
    setMatchedPositions([])
    setPatternError(null)
  }, [])

  const setPattern = useCallback((pattern: string) => {
    gameLoopRef.current?.setPattern(pattern)
  }, [])

  const executePattern = useCallback(() => {
    gameLoopRef.current?.executePattern()
  }, [])

  return {
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
  }
}