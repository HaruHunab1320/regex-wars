import { GridManager } from './GridManager'
import { PatternMatcher } from './PatternMatcher'
import { CharacterGenerator } from './CharacterGenerator'
import { GameStateManager } from './GameStateManager'
import { gameEventManager } from './EventManager'
import { GridPosition } from '../types'

export class GameLoop {
  private gridManager: GridManager
  private patternMatcher: PatternMatcher
  private characterGenerator: CharacterGenerator
  private gameState: GameStateManager

  private animationId: number | null = null
  private lastUpdateTime: number = 0
  private lastFallTime: number = 0
  private lastSpawnTime: number = 0
  
  private spawnInterval: number = 2000 // Time between character spawns (ms)
  private currentMatches: GridPosition[] = []

  constructor(
    gridManager: GridManager,
    patternMatcher: PatternMatcher,
    characterGenerator: CharacterGenerator,
    gameState: GameStateManager
  ) {
    this.gridManager = gridManager
    this.patternMatcher = patternMatcher
    this.characterGenerator = characterGenerator
    this.gameState = gameState
  }

  public start(): void {
    if (this.animationId !== null) return

    this.lastUpdateTime = performance.now()
    this.lastFallTime = this.lastUpdateTime
    this.lastSpawnTime = this.lastUpdateTime
    
    this.gameState.startGame()
    this.update(this.lastUpdateTime)
  }

  public stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  public pause(): void {
    this.gameState.pauseGame()
  }

  public resume(): void {
    this.gameState.resumeGame()
    this.lastUpdateTime = performance.now()
    this.lastFallTime = this.lastUpdateTime
    this.lastSpawnTime = this.lastUpdateTime
  }

  private update = (timestamp: number): void => {
    const deltaTime = timestamp - this.lastUpdateTime
    this.lastUpdateTime = timestamp

    if (this.gameState.isPlaying()) {
      // Update game time
      this.gameState.updateTimeElapsed()

      // Spawn new characters
      if (timestamp - this.lastSpawnTime >= this.spawnInterval) {
        this.spawnCharacters()
        this.lastSpawnTime = timestamp
      }

      // Make characters fall
      const fallSpeed = this.gameState.getState().fallSpeed
      if (timestamp - this.lastFallTime >= fallSpeed) {
        this.updateFallingCharacters()
        this.lastFallTime = timestamp
      }

      // Process pattern matches
      this.processMatches()

      // Check game over
      if (this.gridManager.isGameOver()) {
        this.gameState.endGame()
        gameEventManager.emit('GAME_OVER', {
          score: this.gameState.getState().score,
          level: this.gameState.getState().currentLevel,
          linesCleared: this.gameState.getState().linesCleared,
        })
        this.stop()
        return
      }
    }

    // Continue the game loop
    this.animationId = requestAnimationFrame(this.update)
  }

  private spawnCharacters(): void {
    const level = this.gameState.getState().currentLevel
    
    // Spawn 1-3 characters at random columns
    const numCharacters = Math.floor(Math.random() * 3) + 1
    const usedColumns = new Set<number>()

    for (let i = 0; i < numCharacters; i++) {
      let column: number
      
      // Find an unused column
      do {
        column = Math.floor(Math.random() * this.gridManager.getWidth())
      } while (usedColumns.has(column))
      
      usedColumns.add(column)

      const character = this.characterGenerator.generateCharacter(level)
      const added = this.gridManager.addCharacter(column, character)
      
      if (!added) {
        // Column is full, might trigger game over on next check
        console.warn(`Failed to add character to column ${column}`)
      }
    }
  }

  private updateFallingCharacters(): void {
    const hasChanges = this.gridManager.cascadeDown()
    
    if (hasChanges) {
      // Emit event for UI update
      gameEventManager.emit('GRID_UPDATED', {
        grid: this.gridManager.getGridState(),
      })
    }
  }

  private processMatches(): void {
    const pattern = this.gameState.getState().currentPattern
    
    if (!pattern) {
      // Clear any existing match highlights
      if (this.currentMatches.length > 0) {
        this.gridManager.clearMatchedFlags()
        this.currentMatches = []
        gameEventManager.emit('MATCH_FOUND', { positions: [] })
      }
      return
    }

    // Find matches with current pattern
    const matchResults = this.patternMatcher.findMatches(this.gridManager.getGridState())
    
    // Clear previous match flags
    this.gridManager.clearMatchedFlags()
    
    // Collect all matched positions
    const allPositions: GridPosition[] = []
    matchResults.forEach(result => {
      result.positions.forEach(pos => {
        allPositions.push(pos)
        this.gridManager.markCellAsMatched(pos.row, pos.col)
      })
    })

    this.currentMatches = allPositions

    // Emit match event for UI highlighting
    gameEventManager.emit('MATCH_FOUND', {
      positions: allPositions,
      matches: matchResults,
    })
  }

  public executePattern(): void {
    if (this.currentMatches.length === 0 || !this.gameState.isPlaying()) {
      return
    }

    // Remove matched cells
    this.gridManager.removeMatches(this.currentMatches)

    // Calculate score
    const pattern = this.gameState.getState().currentPattern
    const score = this.gameState.calculateMatchScore(
      this.currentMatches.length,
      pattern.length
    )
    this.gameState.updateScore(score)

    // Check for completed lines
    this.checkCompletedLines()

    // Clear matches
    this.currentMatches = []
    this.gridManager.clearMatchedFlags()

    // Clear the pattern
    this.gameState.updatePattern('')

    // Emit events
    gameEventManager.emit('PATTERN_EXECUTED', {
      matchCount: this.currentMatches.length,
      score: score,
    })
  }

  private checkCompletedLines(): void {
    const completedRows: number[] = []
    
    // Check each row
    for (let row = 0; row < this.gridManager.getHeight(); row++) {
      let isComplete = true
      
      for (let col = 0; col < this.gridManager.getWidth(); col++) {
        if (this.gridManager.getCell(row, col) === null) {
          isComplete = false
          break
        }
      }
      
      if (isComplete) {
        completedRows.push(row)
      }
    }

    if (completedRows.length > 0) {
      // Remove completed rows
      const positions: GridPosition[] = []
      completedRows.forEach(row => {
        for (let col = 0; col < this.gridManager.getWidth(); col++) {
          positions.push({ row, col })
        }
      })
      
      this.gridManager.removeMatches(positions)
      this.gameState.addLinesCleared(completedRows.length)
      
      gameEventManager.emit('LINES_CLEARED', {
        rows: completedRows,
        count: completedRows.length,
      })
    }
  }

  public setPattern(pattern: string): void {
    const isValid = this.patternMatcher.setPattern(pattern)
    
    if (isValid) {
      this.gameState.updatePattern(pattern)
      gameEventManager.emit('PATTERN_CHANGED', { pattern, isValid })
    } else {
      gameEventManager.emit('PATTERN_CHANGED', {
        pattern,
        isValid,
        error: this.patternMatcher.getLastError(),
      })
    }
  }

  public reset(): void {
    this.stop()
    this.gridManager.clearGrid()
    this.gameState.reset()
    this.currentMatches = []
    this.patternMatcher.setPattern('')
  }
}