import { GridCell, GridPosition } from '../types'
import { nanoid } from 'nanoid'

export class GridManager {
  private grid: (GridCell | null)[][]
  private width: number
  private height: number
  private pendingRemovals: Set<string> = new Set()

  constructor(width: number = 20, height: number = 30) {
    this.width = width
    this.height = height
    this.grid = this.createEmptyGrid()
  }

  private createEmptyGrid(): (GridCell | null)[][] {
    return Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(null))
  }

  public addCharacter(column: number, character: string, fallSpeed: number = 1): boolean {
    if (column < 0 || column >= this.width) {
      return false
    }

    // Check if top row at column is occupied
    if (this.grid[0][column] !== null) {
      return false // Cannot add, column is full
    }

    const newCell: GridCell = {
      character,
      id: nanoid(),
      isMatched: false,
      isFalling: true,
      fallSpeed,
    }

    this.grid[0][column] = newCell
    return true
  }

  public removeMatches(positions: GridPosition[]): void {
    // Mark cells for removal
    positions.forEach(({ row, col }) => {
      const cell = this.grid[row]?.[col]
      if (cell) {
        this.pendingRemovals.add(cell.id)
        this.grid[row][col] = null
      }
    })
  }

  public cascadeDown(): boolean {
    let hasChanges = false

    // Process from bottom to top
    for (let row = this.height - 2; row >= 0; row--) {
      for (let col = 0; col < this.width; col++) {
        const cell = this.grid[row][col]
        
        if (cell && cell.isFalling) {
          // Check if cell can fall
          if (this.grid[row + 1][col] === null) {
            // Move cell down
            this.grid[row + 1][col] = cell
            this.grid[row][col] = null
            hasChanges = true
          } else {
            // Cell has landed
            cell.isFalling = false
          }
        }
      }
    }

    // Check for cells that should start falling due to gaps below
    for (let row = this.height - 2; row >= 0; row--) {
      for (let col = 0; col < this.width; col++) {
        const cell = this.grid[row][col]
        
        if (cell && !cell.isFalling && this.grid[row + 1][col] === null) {
          cell.isFalling = true
          hasChanges = true
        }
      }
    }

    return hasChanges
  }

  public getGridState(): (GridCell | null)[][] {
    return this.grid.map(row => [...row])
  }

  public getCell(row: number, col: number): GridCell | null {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) {
      return null
    }
    return this.grid[row][col]
  }

  public isGameOver(): boolean {
    // Game is over if any cell in the top row is not falling
    return this.grid[0].some(cell => cell !== null && !cell.isFalling)
  }

  public clearGrid(): void {
    this.grid = this.createEmptyGrid()
    this.pendingRemovals.clear()
  }

  public getWidth(): number {
    return this.width
  }

  public getHeight(): number {
    return this.height
  }

  public markCellAsMatched(row: number, col: number): void {
    const cell = this.grid[row]?.[col]
    if (cell) {
      cell.isMatched = true
    }
  }

  public clearMatchedFlags(): void {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const cell = this.grid[row][col]
        if (cell) {
          cell.isMatched = false
        }
      }
    }
  }

  // Get all characters in a specific row as a string
  public getRowString(row: number): string {
    if (row < 0 || row >= this.height) return ''
    return this.grid[row].map(cell => cell?.character || ' ').join('')
  }

  // Get all characters in a specific column as a string
  public getColumnString(col: number): string {
    if (col < 0 || col >= this.width) return ''
    return this.grid.map(row => row[col]?.character || ' ').join('')
  }

  // Get the entire grid as a string for pattern matching
  public getGridAsString(): string[] {
    const rows: string[] = []
    for (let row = 0; row < this.height; row++) {
      rows.push(this.getRowString(row))
    }
    return rows
  }
}