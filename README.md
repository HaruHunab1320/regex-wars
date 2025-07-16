# Regex Wars 🔥

> A cyberpunk-themed puzzle game that teaches regex mastery through addictive Tetris-like gameplay.

## 🎮 Game Concept

Regex Wars combines the satisfaction of pattern matching with the pressure of falling-block puzzle games. Players write regex patterns to clear matching characters from a grid before it fills up, all wrapped in a sleek cyberpunk hacker aesthetic.

### Core Gameplay Loop

- Characters fall from the top of the screen in a grid formation
- Player writes regex patterns in a command-line interface at the bottom
- Matching characters dissolve with neon effects and cascade down
- New characters spawn to maintain pressure
- Success creates satisfying visual feedback and scoring opportunities

## 🎯 Design Principles

### Visual Design

- **Cyberpunk Aesthetic**: Dark backgrounds, neon highlights, monospace fonts
- **Terminal Interface**: Command-line regex input with real-time preview
- **Satisfying Feedback**: Particle effects, screen glitches, cascade animations
- **Information Dense**: HUD elements show efficiency metrics and progression

### Gameplay Design

- **Progressive Difficulty**: Start with basic character matching, advance to complex lookaheads
- **Multiple Pressure Systems**: Time pressure, grid filling, combo opportunities
- **Skill-Based Scoring**: Reward pattern efficiency and creative solutions
- **Real-Time Learning**: Visual feedback shows exactly what patterns match

### Technical Design

- **TypeScript/React**: Modern web stack for responsive UI
- **Modular Architecture**: Separate game engine, UI components, and pattern validation
- **Performance Focused**: Smooth 60fps gameplay with efficient rendering
- **Extensible**: Easy to add new game modes, levels, and regex features

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser with ES6+ support

### Installation

```bash
git clone https://github.com/username/regex-wars.git
cd regex-wars
npm install
npm run dev
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run test suite
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── GameGrid/       # Main game grid and character display
│   ├── CommandLine/    # Regex input interface
│   ├── HUD/           # Score, efficiency, and status displays
│   └── UI/            # Shared UI components
├── game/              # Core game engine
│   ├── GridManager.ts # Grid state and character management
│   ├── PatternMatcher.ts # Regex validation and matching
│   ├── ScoreSystem.ts # Scoring and combo logic
│   └── GameState.ts   # Overall game state management
├── levels/            # Level definitions and progression
├── audio/             # Sound effects and music
├── assets/            # Images, fonts, and static resources
└── utils/             # Shared utilities and helpers
```

## 🎮 Game Modes

### Campaign Mode

Progressive difficulty with structured learning curve:

- **Level 1-5**: Basic character matching (a-z, 0-9)
- **Level 6-10**: Character classes and quantifiers
- **Level 11-15**: Groups and alternation
- **Level 16-20**: Advanced features (lookaheads, boundaries)

### Arena Mode

Real-time PvP battles where players race to clear patterns.

### Defense Mode

Tower-defense style gameplay where regex patterns filter incoming threats.

### Zen Mode

Practice mode with no time pressure for learning and experimentation.

## 🛠️ Development Phases

This project is structured in phases for systematic development:

1. **Phase 1**: Core game mechanics and basic UI
2. **Phase 2**: Visual polish and cyberpunk theming
3. **Phase 3**: Level system and progression
4. **Phase 4**: Advanced game modes and features
5. **Phase 5**: Performance optimization and polish

See individual phase documentation for detailed implementation guides.

## 🎨 Art Style Guide

### Color Palette

- **Primary**: Neon green (`#00ff41`) for successful matches
- **Secondary**: Cyan (`#00ffff`) for UI highlights
- **Accent**: Hot pink (`#ff1493`) for special effects
- **Background**: Deep black (`#000000`) to dark gray (`#111111`)
- **Text**: Bright white (`#ffffff`) for readability

### Typography

- **Primary Font**: JetBrains Mono or similar monospace
- **UI Elements**: Clean, terminal-inspired styling
- **Animations**: Smooth transitions with cyberpunk flair

## 🧪 Testing Strategy

### Unit Tests

- Regex pattern validation
- Grid state management
- Scoring calculations
- Character generation logic

### Integration Tests

- Complete gameplay loops
- Level progression
- Save/load functionality

### Performance Tests

- Frame rate consistency
- Memory usage optimization
- Large grid handling

## 🚢 Deployment

### Build Process

```bash
npm run build        # Creates optimized production build
npm run preview      # Preview production build locally
```

### Environment Variables

```env
VITE_API_URL=        # Backend API endpoint (if needed)
VITE_ANALYTICS_ID=   # Analytics tracking ID
VITE_VERSION=        # Game version number
```

## 📈 Success Metrics

### Player Engagement

- Session duration and frequency
- Level completion rates
- Pattern complexity progression

### Learning Effectiveness

- Pre/post regex knowledge assessment
- Pattern efficiency improvements
- Error rate reduction over time

### Technical Performance

- Load times under 3 seconds
- Consistent 60fps gameplay
- Cross-browser compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards (ESLint + Prettier)
4. Write tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Tetris and terminal-based puzzle games
- Cyberpunk aesthetic influenced by movies like The Matrix and shows like Severance
- Regex learning approach based on interactive coding platforms

---

> *"In the digital realm, patterns are power. Master the regex, master the grid."*

