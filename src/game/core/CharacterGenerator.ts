export class CharacterGenerator {
  private characterSets: Map<number, string[]>
  private weights: Map<string, number>

  constructor() {
    this.characterSets = this.initializeCharacterSets()
    this.weights = this.initializeWeights()
  }

  private initializeCharacterSets(): Map<number, string[]> {
    const sets = new Map<number, string[]>()

    // Level 1-5: Basic lowercase letters (common ones)
    sets.set(1, ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'l'])
    
    // Level 6-10: All lowercase letters
    sets.set(6, 'abcdefghijklmnopqrstuvwxyz'.split(''))
    
    // Level 11-15: Lowercase + numbers
    sets.set(11, 'abcdefghijklmnopqrstuvwxyz0123456789'.split(''))
    
    // Level 16-20: Lowercase + uppercase + numbers
    sets.set(16, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''))
    
    // Level 21+: All previous + special characters
    sets.set(21, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'.split(''))

    return sets
  }

  private initializeWeights(): Map<string, number> {
    const weights = new Map<string, number>()

    // Vowels appear more frequently
    const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']
    vowels.forEach(v => weights.set(v, 3))

    // Common consonants
    const commonConsonants = ['r', 's', 't', 'n', 'l', 'R', 'S', 'T', 'N', 'L']
    commonConsonants.forEach(c => weights.set(c, 2))

    // Numbers are less common
    '0123456789'.split('').forEach(n => weights.set(n, 0.5))

    // Special characters are rare
    '!@#$%^&*()_+-=[]{}|;:,.<>?'.split('').forEach(s => weights.set(s, 0.2))

    return weights
  }

  public generateCharacter(level: number): string {
    const characterSet = this.getCharacterSet(level)
    
    // Build weighted array
    const weightedChars: string[] = []
    
    for (const char of characterSet) {
      const weight = this.weights.get(char) || 1
      const count = Math.ceil(weight * 10) // Convert weight to count
      
      for (let i = 0; i < count; i++) {
        weightedChars.push(char)
      }
    }

    // Select random character from weighted array
    const randomIndex = Math.floor(Math.random() * weightedChars.length)
    return weightedChars[randomIndex]
  }

  public generateMultipleCharacters(level: number, count: number): string[] {
    const characters: string[] = []
    
    for (let i = 0; i < count; i++) {
      characters.push(this.generateCharacter(level))
    }
    
    return characters
  }

  public getCharacterSet(level: number): string[] {
    // Find the appropriate character set for the level
    let appropriateSet: string[] = []
    
    for (const [minLevel, chars] of this.characterSets) {
      if (level >= minLevel) {
        appropriateSet = chars
      }
    }

    return appropriateSet.length > 0 ? appropriateSet : ['a', 'b', 'c'] // Fallback
  }

  public updateWeights(level: number): void {
    // Adjust weights based on level
    if (level > 10) {
      // Make numbers more common at higher levels
      '0123456789'.split('').forEach(n => this.weights.set(n, 1))
    }

    if (level > 15) {
      // Make uppercase letters more common
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(c => {
        const currentWeight = this.weights.get(c) || 1
        this.weights.set(c, currentWeight * 1.5)
      })
    }

    if (level > 20) {
      // Special characters become more common
      '!@#$%^&*()_+-=[]{}|;:,.<>?'.split('').forEach(s => {
        this.weights.set(s, 0.5)
      })
    }
  }

  // Get a preview of what characters will appear at a given level
  public getCharacterPreview(level: number): { 
    characters: string[], 
    distribution: Map<string, number> 
  } {
    const characterSet = this.getCharacterSet(level)
    const distribution = new Map<string, number>()

    // Calculate distribution percentages
    let totalWeight = 0
    for (const char of characterSet) {
      const weight = this.weights.get(char) || 1
      totalWeight += weight
      distribution.set(char, weight)
    }

    // Convert to percentages
    for (const [char, weight] of distribution) {
      distribution.set(char, (weight / totalWeight) * 100)
    }

    return { characters: characterSet, distribution }
  }
}