export const cyberpunkTheme = {
  colors: {
    primary: {
      neonGreen: '#00ff41',
      neonCyan: '#00ffff',
      neonPink: '#ff1493',
      neonBlue: '#0080ff',
    },
    background: {
      deepBlack: '#000000',
      darkGray: '#111111',
      charcoal: '#1a1a1a',
    },
    text: {
      white: '#ffffff',
      green: '#00ff41',
      red: '#ff0040',
      gray: '#888888',
    },
  },
  effects: {
    glow: {
      small: '0 0 5px currentColor',
      medium: '0 0 10px currentColor',
      large: '0 0 20px currentColor',
      intense: '0 0 30px currentColor',
    },
    neonGlow: (color: string) => `
      0 0 5px ${color},
      0 0 10px ${color},
      0 0 15px ${color},
      0 0 20px ${color}
    `,
    textGlow: (color: string) => `0 0 8px ${color}`,
    boxGlow: (color: string) => `0 0 15px ${color}`,
  },
  animations: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      verySlow: '1000ms',
    },
    easing: {
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '3rem',
  },
} as const

export type CyberpunkTheme = typeof cyberpunkTheme