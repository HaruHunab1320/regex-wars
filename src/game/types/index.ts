export interface GridPosition {
  row: number
  col: number
}

export interface GridCell {
  character: string
  id: string
  isMatched: boolean
  isFalling: boolean
  fallSpeed: number
}

export interface MatchResult {
  positions: GridPosition[]
  matchedText: string
  patternUsed: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface GameState {
  isPlaying: boolean
  isPaused: boolean
  isGameOver: boolean
  currentLevel: number
  score: number
  linesCleared: number
  currentPattern: string
  fallSpeed: number
  timeElapsed: number
}

export interface GameConfig {
  gridWidth: number
  gridHeight: number
  initialFallSpeed: number
  fallSpeedIncrement: number
  scorePerMatch: number
  scorePerLine: number
  maxLevel: number
}

export type GameEventType = 
  | 'MATCH_FOUND' 
  | 'LINES_CLEARED' 
  | 'GAME_OVER' 
  | 'LEVEL_UP'
  | 'PATTERN_CHANGED'
  | 'SCORE_UPDATED'

export interface GameEvent {
  type: GameEventType
  payload: any
  timestamp: number
}