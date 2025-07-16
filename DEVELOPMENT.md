# Development Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```

3. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Game Engine**: Phaser 3
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Package Manager**: pnpm
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── game/        # Game-specific components
│   ├── ui/          # Shared UI components
│   └── layouts/     # Layout components
├── game/            # Game engine logic
│   ├── core/        # Core game mechanics
│   ├── systems/     # Game systems (physics, input, etc.)
│   └── scenes/      # Phaser scenes
├── lib/             # External library configurations
├── hooks/           # Custom React hooks
├── store/           # Zustand stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── assets/          # Static assets (images, sounds)
└── styles/          # Global styles and CSS modules
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate test coverage report
- `pnpm format` - Format code with Prettier
- `pnpm analyze` - Analyze bundle size

## Development Workflow

1. **Feature Development:**
   - Create feature branch from `main`
   - Follow the coding standards
   - Write tests for new functionality
   - Ensure all tests pass

2. **Code Quality:**
   - Run `pnpm lint` before committing
   - Run `pnpm type-check` to ensure type safety
   - Format code with `pnpm format`

3. **Performance:**
   - Monitor bundle size with `pnpm analyze`
   - Ensure 60fps gameplay performance
   - Test on various devices

## Environment Variables

Create a `.env.local` file for local development:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Feature Flags
NEXT_PUBLIC_ENABLE_MULTIPLAYER=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Game Development

### Phaser Integration

The game engine is integrated with React using a custom wrapper component. Game scenes are managed separately from React components to maintain performance.

### State Management

- **React State**: UI state, menus, settings
- **Zustand**: Global game state, player progress
- **Phaser State**: Game-specific state within scenes

### Performance Considerations

- Use object pooling for frequently created/destroyed objects
- Implement efficient collision detection
- Optimize sprite sheets and texture atlases
- Use Web Workers for regex pattern matching if needed

## Testing Strategy

### Unit Tests
- Test game logic independently
- Test regex pattern matching
- Test scoring algorithms

### Integration Tests
- Test game scenes
- Test React-Phaser integration
- Test state synchronization

### E2E Tests (Future)
- Test complete game flows
- Test multiplayer functionality
- Test performance under load

## Deployment

The project is configured for deployment on Vercel:

1. Push to `main` branch
2. Vercel automatically builds and deploys
3. Preview deployments for pull requests

## Troubleshooting

### Common Issues

1. **Module not found errors:**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `pnpm install`

2. **Type errors:**
   - Run `pnpm type-check` to identify issues
   - Check `tsconfig.json` path mappings

3. **Performance issues:**
   - Check Chrome DevTools Performance tab
   - Use React DevTools Profiler
   - Monitor memory usage

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.