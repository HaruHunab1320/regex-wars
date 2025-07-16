# Phase 1: Core Game Mechanics

**Timeline**: 2-3 weeks  
**Priority**: Foundation for all subsequent development

## 🎯 Phase Objectives

Build the fundamental game engine and basic UI components that enable core gameplay. This phase focuses on functionality over aesthetics - create a working prototype that demonstrates the core Tetris-like regex matching concept.

## 📋 Deliverables

### 1. Grid Management System
**File**: `src/game/GridManager.ts`

**Requirements**:
- 20x30 character grid (adjustable via config)
- Characters fall from top at configurable intervals
- Support for character removal and cascading
- Grid state persistence and restoration
- Collision detection for "game over" conditions

**Key Classes/Interfaces**:
```typescript
interface GridCell {
  character: string;
  id: string;
  isMatched: boolean;
  fallSpeed: number;
}

class GridManager {
  private grid: (GridCell | null)[][];
  private width: number;
  private height: number;
  
  // Core methods to implement
  public addCharacter(column: number, character: string): void;
  public removeMatches(positions: GridPosition[]): void;
  public cascadeDown(): void;
  public getGridState(): GridCell[][];
  public isGameOver(): boolean;
}
```

### 2. Pattern Matching Engine
**File**: `src/game/PatternMatcher.ts`

**Requirements**:
- Real-time regex validation and compilation
- Find all matches in current grid state
- Return match positions for visual highlighting
- Error handling for invalid regex patterns
- Performance optimization for continuous matching

**Key Implementation**:
```typescript
class PatternMatcher {
  private currentPattern: RegExp | null;
  private lastError: string | null;
  
  public setPattern(pattern: string): boolean;
  public findMatches(grid: GridCell[][]): MatchResult[];
  public validatePattern(pattern: string): ValidationResult;
  public getLastError(): string | null;
}

interface MatchResult {
  positions: GridPosition[];
  matchedText: string;
  patternUsed: string;
}
```

### 3. Basic Game State Management
**File**: `src/game/GameState.ts`

**Requirements**:
- Track current level, score, and game status
- Manage game timing and progression
- Handle pause/resume functionality
- Provide game state updates to UI components

**State Structure**:
```typescript
interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentLevel: number;
  score: number;
  linesCleared: number;
  currentPattern: string;
  fallSpeed: number;
  timeElapsed: number;
}
```

### 4. Core UI Components

#### GameGrid Component
**File**: `src/components/GameGrid/GameGrid.tsx`

**Requirements**:
- Render 20x30 grid of characters
- Display falling characters with smooth animations
- Highlight matched characters before removal
- Show cascade effects when characters fall
- Responsive design for different screen sizes

**Props Interface**:
```typescript
interface GameGridProps {
  grid: (GridCell | null)[][];
  matchHighlights: GridPosition[];
  onAnimationComplete: () => void;
}
```

#### CommandLine Component
**File**: `src/components/CommandLine/CommandLine.tsx`

**Requirements**:
- Terminal-style regex input field
- Real-time pattern validation feedback
- Display regex syntax errors
- Submit patterns on Enter key
- Command history (up/down arrows)

**Features**:
- Monospace font styling
- Syntax highlighting for regex patterns
- Error state visualization
- Auto-completion suggestions for common patterns

#### Basic HUD Component
**File**: `src/components/HUD/BasicHUD.tsx`

**Requirements**:
- Display current score and level
- Show lines cleared counter
- Pattern efficiency metric
- Simple timer display

### 5. Character Generation System
**File**: `src/game/CharacterGenerator.ts`

**Requirements**:
- Generate random characters based on level difficulty
- Weighted character distribution (more vowels, common letters)
- Special character introduction at higher levels
- Configurable character sets per level

**Implementation**:
```typescript
class CharacterGenerator {
  private characterSets: Map<number, string[]>;
  private weights: Map<string, number>;
  
  public generateCharacter(level: number): string;
  public getCharacterSet(level: number): string[];
  public updateWeights(level: number): void;
}
```

## 🔧 Technical Implementation Details

### Game Loop Structure
```typescript
class GameLoop {
  private gameState: GameState;
  private gridManager: GridManager;
  private patternMatcher: PatternMatcher;
  private lastUpdateTime: number = 0;
  
  public start(): void;
  public update(timestamp: number): void;
  public pause(): void;
  public resume(): void;
  private processMatches(): void;
  private updateFallingCharacters(): void;
}
```

### Event System
Implement a simple event system for communication between components:
```typescript
interface GameEvent {
  type: 'MATCH_FOUND' | 'LINES_CLEARED' | 'GAME_OVER' | 'LEVEL_UP';
  payload: any;
}

class EventManager {
  private listeners: Map<string, Function[]>;
  public subscribe(eventType: string, callback: Function): void;
  public emit(event: GameEvent): void;
}
```

### Performance Considerations
- Use `requestAnimationFrame` for smooth animations
- Implement object pooling for grid cells to reduce garbage collection
- Debounce regex compilation to avoid excessive processing
- Use React.memo for grid cell components to prevent unnecessary re-renders

## 🧪 Testing Requirements

### Unit Tests
Create tests for each core class:
- `GridManager.test.ts`: Grid manipulation and state management
- `PatternMatcher.test.ts`: Regex validation and matching logic
- `CharacterGenerator.test.ts`: Character generation and distribution
- `GameState.test.ts`: State transitions and game flow

### Integration Tests
- Complete gameplay loop from pattern input to character removal
- Grid cascading behavior with multiple matches
- Game over detection and handling

### Test Data
Create fixture data for consistent testing:
```typescript
// testFixtures.ts
export const sampleGrids = {
  basicPattern: [
    ['a', 'b', 'c', 'd'],
    ['e', 'f', 'g', 'h'],
    // ... more test grids
  ],
  regexPatterns: [
    { pattern: '[a-z]', shouldMatch: true },
    { pattern: '[0-9]+', shouldMatch: false },
    // ... more test patterns
  ]
};
```

## 🎮 Basic Gameplay Flow

1. **Initialization**: Grid starts empty, characters begin falling
2. **Pattern Input**: Player types regex pattern in command line
3. **Real-time Matching**: Pattern matcher continuously finds matches
4. **Visual Feedback**: Matched characters highlighted in real-time
5. **Pattern Execution**: Player presses Enter to remove matches
6. **Cascade Effect**: Characters above fall down to fill gaps
7. **Scoring**: Points awarded based on matches and pattern efficiency
8. **Continuation**: New characters spawn, cycle repeats

## 🚀 Success Criteria

### Functional Requirements
- [ ] Grid displays 20x30 characters correctly
- [ ] Characters fall at consistent intervals
- [ ] Regex patterns compile and match accurately
- [ ] Matched characters are removed and grid cascades
- [ ] Score increases with successful matches
- [ ] Game over detection works properly

### Performance Requirements
- [ ] 60fps gameplay with no dropped frames
- [ ] Regex compilation completes within 16ms
- [ ] Grid updates render smoothly
- [ ] Memory usage remains stable during extended play

### User Experience
- [ ] Responsive controls with no input lag
- [ ] Clear visual feedback for all actions
- [ ] Intuitive command line interface
- [ ] Error messages help users fix regex issues

## 📋 Phase 1 Checklist

### Week 1: Core Engine
- [ ] Set up TypeScript project structure
- [ ] Implement GridManager with basic operations
- [ ] Create PatternMatcher with regex validation
- [ ] Build CharacterGenerator for random characters
- [ ] Establish basic game loop structure

### Week 2: UI Components
- [ ] Create GameGrid component with character display
- [ ] Build CommandLine component with regex input
- [ ] Implement BasicHUD for score and stats
- [ ] Connect components to game engine
- [ ] Add basic keyboard controls

### Week 3: Integration & Testing
- [ ] Complete gameplay loop integration
- [ ] Implement character cascading animations
- [ ] Add game over detection and restart
- [ ] Write comprehensive test suite
- [ ] Performance optimization and bug fixes

## 🔄 Handoff to Phase 2

At the end of Phase 1, you should have:
- A working prototype with core gameplay mechanics
- Clean, well-tested codebase ready for visual enhancements
- Basic UI that clearly demonstrates the game concept
- Performance metrics showing stable 60fps gameplay
- Documentation of any technical decisions or challenges

The prototype should be playable and demonstrate the core value proposition, even if it lacks the cyberpunk polish planned for Phase 2.