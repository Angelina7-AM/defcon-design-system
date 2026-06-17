/**
 * JS mirror of the CSS custom properties in styles/tokens.css.
 * Useful for consumers that need token values in JS (charts, canvas, etc.).
 * Keep in sync with styles/tokens.css.
 *
 * Synced to the canonical DEFCON AI brand palette:
 *   Dark #000814 · Indigo #001D3D · Sky #003566 · Gold #FFC300 · Light #EEEEEF
 * See styles/tokens.css for the [brand]/[derived]/[kept]/[added] rationale.
 */
export const tokens = {
  surface: {
    0: '#000814', // brand Dark
    1: '#001d3d', // brand Indigo
    2: '#003566', // brand Sky
    3: '#00427a', // derived — one step beyond Sky
  },
  border: {
    subtle: '#102a47', // derived navy hairline
    strong: '#1b3f66', // derived navy hairline
  },
  text: {
    primary: '#eeeeef',   // brand Light
    secondary: '#9ca3b0', // derived — dimmed from Light
    muted: '#5f6776',     // derived — dimmed from Light
  },
  accent: {
    base: '#ffc300',     // brand Gold (was #ffb000)
    hover: '#ffce33',    // derived — lighter gold
    pressed: '#e0ac00',  // derived — darker gold
    contrast: '#000814', // brand Dark — text/icons on gold
  },
  status: {
    danger: '#ff4d4d',  // kept — no brand equivalent
    success: '#36d399', // kept — no brand equivalent
    warning: '#ffc300', // brand Gold — note: identical to accent (pre-existing)
  },
  font: {
    sans: "'Inter', system-ui, -apple-system, sans-serif", // brand digital/web
    mono: "'IBM Plex Mono', ui-monospace, monospace",      // kept (JetBrains Mono removed)
    title: "'Montserrat', sans-serif", // added — brand titles (Semi Bold), needs wiring
    body: "'Lato', sans-serif",        // added — brand body / print, needs wiring
  },
  radius: { sm: '4px', md: '6px', lg: '10px' },
  space: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 6: '24px', 8: '32px' },
} as const;
export type Tokens = typeof tokens;
