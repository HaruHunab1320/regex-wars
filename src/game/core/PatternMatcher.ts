import { GridCell, GridPosition, MatchResult, ValidationResult } from '../types'

export class PatternMatcher {
  private currentPattern: RegExp | null = null
  private lastError: string | null = null
  private patternString: string = ''

  public setPattern(pattern: string): boolean {
    this.patternString = pattern
    this.lastError = null

    if (!pattern) {
      this.currentPattern = null
      return true
    }

    try {
      // Test the regex pattern
      this.currentPattern = new RegExp(pattern, 'g')
      return true
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Invalid regex pattern'
      this.currentPattern = null
      return false
    }
  }

  public findMatches(grid: (GridCell | null)[][]): MatchResult[] {
    if (!this.currentPattern) {
      return []
    }

    const matches: MatchResult[] = []
    const height = grid.length
    const width = grid[0]?.length || 0

    // Reset regex lastIndex for global flag
    this.currentPattern.lastIndex = 0

    // Search horizontally (in rows)
    for (let row = 0; row < height; row++) {
      const rowString = grid[row].map(cell => cell?.character || ' ').join('')
      this.findMatchesInString(rowString, matches, (index, length) => {
        const positions: GridPosition[] = []
        for (let i = 0; i < length; i++) {
          positions.push({ row, col: index + i })
        }
        return positions
      })
    }

    // Search vertically (in columns)
    for (let col = 0; col < width; col++) {
      const colString = grid.map(row => row[col]?.character || ' ').join('')
      this.findMatchesInString(colString, matches, (index, length) => {
        const positions: GridPosition[] = []
        for (let i = 0; i < length; i++) {
          positions.push({ row: index + i, col })
        }
        return positions
      })
    }

    // Search diagonally (top-left to bottom-right)
    for (let startRow = 0; startRow < height; startRow++) {
      const diagString = this.getDiagonalString(grid, startRow, 0, 1, 1)
      this.findMatchesInString(diagString, matches, (index, length) => {
        const positions: GridPosition[] = []
        for (let i = 0; i < length; i++) {
          positions.push({ row: startRow + index + i, col: index + i })
        }
        return positions
      })
    }
    for (let startCol = 1; startCol < width; startCol++) {
      const diagString = this.getDiagonalString(grid, 0, startCol, 1, 1)
      this.findMatchesInString(diagString, matches, (index, length) => {
        const positions: GridPosition[] = []
        for (let i = 0; i < length; i++) {
          positions.push({ row: index + i, col: startCol + index + i })
        }
        return positions
      })
    }

    // Search diagonally (top-right to bottom-left)
    for (let startRow = 0; startRow < height; startRow++) {
      const diagString = this.getDiagonalString(grid, startRow, width - 1, 1, -1)
      this.findMatchesInString(diagString, matches, (index, length) => {
        const positions: GridPosition[] = []
        for (let i = 0; i < length; i++) {
          positions.push({ row: startRow + index + i, col: width - 1 - (index + i) })
        }
        return positions
      })
    }
    for (let startCol = width - 2; startCol >= 0; startCol--) {
      const diagString = this.getDiagonalString(grid, 0, startCol, 1, -1)
      this.findMatchesInString(diagString, matches, (index, length) => {
        const positions: GridPosition[] = []
        for (let i = 0; i < length; i++) {
          positions.push({ row: index + i, col: startCol - (index + i) })
        }
        return positions
      })
    }

    // Remove duplicate matches (same positions)
    return this.deduplicateMatches(matches)
  }

  private findMatchesInString(
    str: string,
    matches: MatchResult[],
    positionMapper: (index: number, length: number) => GridPosition[]
  ): void {
    if (!this.currentPattern) return

    // Reset lastIndex for each string search
    this.currentPattern.lastIndex = 0
    
    let match: RegExpExecArray | null
    while ((match = this.currentPattern.exec(str)) !== null) {
      // Skip empty matches to prevent infinite loops
      if (match[0].length === 0) {
        this.currentPattern.lastIndex++
        continue
      }

      // Skip matches that include spaces (empty cells)
      if (match[0].includes(' ')) {
        continue
      }

      const positions = positionMapper(match.index, match[0].length)
      matches.push({
        positions,
        matchedText: match[0],
        patternUsed: this.patternString,
      })
    }
  }

  private getDiagonalString(
    grid: (GridCell | null)[][],
    startRow: number,
    startCol: number,
    rowDir: number,
    colDir: number
  ): string {
    const chars: string[] = []
    let row = startRow
    let col = startCol
    const height = grid.length
    const width = grid[0]?.length || 0

    while (row >= 0 && row < height && col >= 0 && col < width) {
      chars.push(grid[row][col]?.character || ' ')
      row += rowDir
      col += colDir
    }

    return chars.join('')
  }

  private deduplicateMatches(matches: MatchResult[]): MatchResult[] {
    const seen = new Map<string, MatchResult>()

    for (const match of matches) {
      // Create a unique key for this match based on positions
      const key = match.positions
        .map(p => `${p.row},${p.col}`)
        .sort()
        .join('|')

      if (!seen.has(key)) {
        seen.set(key, match)
      }
    }

    return Array.from(seen.values())
  }

  public validatePattern(pattern: string): ValidationResult {
    if (!pattern) {
      return { isValid: true }
    }

    try {
      new RegExp(pattern)
      return { isValid: true }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid regex pattern',
      }
    }
  }

  public getLastError(): string | null {
    return this.lastError
  }

  public getCurrentPattern(): string {
    return this.patternString
  }
}