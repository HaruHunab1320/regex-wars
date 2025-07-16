import { GameState, GameConfig } from '../types'

export const DEFAULT_CONFIG: GameConfig = {
  gridWidth: 20,
  gridHeight: 30,
  initialFallSpeed: 1000, // milliseconds between falls
  fallSpeedIncrement: 50, // speed increase per level (ms)
  scorePerMatch: 10,
  scorePerLine: 100,
  maxLevel: 30,
}

export class GameStateManager {
  private state: GameState
  private config: GameConfig
  private startTime: number = 0
  private pausedTime: number = 0
  private listeners: Map<string, ((state: GameState) => void)[]> = new Map()

  constructor(config: Partial<GameConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.state = this.createInitialState()
  }

  private createInitialState(): GameState {
    return {
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      currentLevel: 1,
      score: 0,
      linesCleared: 0,
      currentPattern: '',
      fallSpeed: this.config.initialFallSpeed,
      timeElapsed: 0,
    }
  }

  public startGame(): void {
    this.state = {
      ...this.createInitialState(),
      isPlaying: true,
    }
    this.startTime = Date.now()
    this.notifyListeners()
  }

  public pauseGame(): void {
    if (this.state.isPlaying && !this.state.isPaused) {
      this.state.isPaused = true
      this.pausedTime = Date.now()
      this.notifyListeners()
    }
  }

  public resumeGame(): void {
    if (this.state.isPlaying && this.state.isPaused) {
      this.state.isPaused = false
      // Adjust start time to account for pause duration
      const pauseDuration = Date.now() - this.pausedTime
      this.startTime += pauseDuration
      this.notifyListeners()
    }
  }

  public endGame(): void {
    this.state.isPlaying = false
    this.state.isGameOver = true
    this.notifyListeners()
  }

  public updateScore(points: number): void {
    this.state.score += points
    this.notifyListeners()
  }

  public addLinesCleared(lines: number): void {
    this.state.linesCleared += lines
    this.state.score += lines * this.config.scorePerLine
    
    // Check for level up (every 10 lines)
    const newLevel = Math.floor(this.state.linesCleared / 10) + 1
    if (newLevel > this.state.currentLevel && newLevel <= this.config.maxLevel) {
      this.levelUp()
    }
    
    this.notifyListeners()
  }

  private levelUp(): void {
    this.state.currentLevel++
    
    // Increase fall speed (decrease time between falls)
    this.state.fallSpeed = Math.max(
      100, // Minimum 100ms between falls
      this.config.initialFallSpeed - (this.state.currentLevel - 1) * this.config.fallSpeedIncrement
    )
    
    this.notifyListeners()
  }

  public updatePattern(pattern: string): void {
    this.state.currentPattern = pattern
    this.notifyListeners()
  }

  public updateTimeElapsed(): void {
    if (this.state.isPlaying && !this.state.isPaused) {
      this.state.timeElapsed = Date.now() - this.startTime
      this.notifyListeners()
    }
  }

  public getState(): GameState {
    return { ...this.state }
  }

  public getConfig(): GameConfig {
    return { ...this.config }
  }

  public isPlaying(): boolean {
    return this.state.isPlaying && !this.state.isPaused && !this.state.isGameOver
  }

  public subscribe(event: string, callback: (state: GameState) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    
    this.listeners.get(event)!.push(callback)
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private notifyListeners(): void {
    // Notify general state change listeners
    const stateListeners = this.listeners.get('stateChange') || []
    stateListeners.forEach(callback => callback(this.getState()))
    
    // Notify specific event listeners
    if (this.state.isGameOver) {
      const gameOverListeners = this.listeners.get('gameOver') || []
      gameOverListeners.forEach(callback => callback(this.getState()))
    }
  }

  public reset(): void {
    this.state = this.createInitialState()
    this.startTime = 0
    this.pausedTime = 0
    this.notifyListeners()
  }

  // Calculate score for a pattern match based on efficiency
  public calculateMatchScore(matchLength: number, patternLength: number): number {
    const baseScore = matchLength * this.config.scorePerMatch
    
    // Bonus for efficient patterns (shorter pattern for same match)
    const efficiencyBonus = matchLength > patternLength 
      ? Math.floor((matchLength / patternLength) * 10) 
      : 0
    
    return baseScore + efficiencyBonus
  }
}