/**
 * JS mirror of the CSS custom properties in styles/tokens.css.
 * Useful for consumers that need token values in JS (charts, canvas, etc.).
 * Keep in sync with styles/tokens.css.
 */
export const tokens = {
  surface: {
    0: '#0a0a0b',
    1: '#141417',
    2: '#1c1c20',
    3: '#26262b',
  },
  border: {
    subtle: '#2a2a30',
    strong: '#3a3a42',
  },
  text: {
    primary: '#f4f4f5',
    secondary: '#a1a1aa',
    muted: '#6b6b73',
  },
  accent: {
    base: '#ffb000',
    hover: '#ffbf2e',
    pressed: '#e09a00',
    contrast: '#0a0a0b',
  },
  status: {
    danger: '#ff4d4d',
    success: '#36d399',
    warning: '#ffb000',
  },
  font: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
  },
  radius: { sm: '4px', md: '6px', lg: '10px' },
  space: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 6: '24px', 8: '32px' },
} as const;

export type Tokens = typeof tokens;
