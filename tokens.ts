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


/**
 * Text (foreground) colors from the Figma "Text color variables" spec
 * (file Pxlc9tI2bzrMBFSHfz41s7, node 1146:1473) — the JS mirror of the
 * `--color-text-*` custom properties in tokens.css. Keep the two in sync.
 *
 * Each key is the CSS variable's suffix in camelCase, e.g. `fgBrandStrong`
 * mirrors `--color-text-fg-brand-strong`.
 *
 * `dark` is a complete set, not a diff: the four mode-invariant tokens
 * (white, black, fgBrandSubtle, fgYellow) repeat their light value, so a
 * consumer can index either mode without falling back.
 */
export const textColors = {
  light: {
    white: '#ffffff',
    black: '#030712',
    heading: '#101828',
    body: '#4a5565',
    bodySubtle: '#6a7282',
    fgBrandSubtle: '#bedbff',
    fgBrand: '#1447e6',
    fgBrandStrong: '#1c398e',
    fgSuccess: '#007a55',
    fgSuccessStrong: '#004f3b',
    fgDanger: '#c70036',
    fgDangerStrong: '#8b0836',
    fgWarningSubtle: '#e17100',
    fgWarning: '#7b3306',
    fgYellow: '#fdc700',
    fgInfo: '#1c398e',
    fgDisabled: '#99a1af',
    fgPurple: '#9810fa',
    fgCyan: '#0092b8',
    fgIndigo: '#4f39f6',
    fgPink: '#e60076',
    fgLime: '#5ea500',
  },
  dark: {
    white: '#ffffff',
    black: '#030712',
    heading: '#ffffff',
    body: '#99a1af',
    bodySubtle: '#99a1af',
    fgBrandSubtle: '#bedbff',
    fgBrand: '#2b7fff',
    fgBrandStrong: '#51a2ff',
    fgSuccess: '#009966',
    fgSuccessStrong: '#5ee9b5',
    fgDanger: '#ff2056',
    fgDangerStrong: '#ffa1ad',
    fgWarningSubtle: '#ff5a1f',
    fgWarning: '#fdba8c',
    fgYellow: '#fdc700',
    fgInfo: '#8ec5ff',
    fgDisabled: '#4a5565',
    fgPurple: '#ad46ff',
    fgCyan: '#00b8db',
    fgIndigo: '#615fff',
    fgPink: '#f6339a',
    fgLime: '#7ccf00',
  },
} as const;
export type TextColors = typeof textColors;
export type TextColorMode = keyof TextColors;
export type TextColorName = keyof TextColors['light'];


/**
 * Background colors from the Figma "Background color variables" spec
 * (file Pxlc9tI2bzrMBFSHfz41s7, node 1146:1838) — the JS mirror of the
 * `--color-bg-*` custom properties in tokens.css. Keep the two in sync.
 *
 * Several shades intentionally share a value in `light` and diverge in `dark`;
 * that layering is the point of the scale, not an error.
 *
 * Like `textColors`, `dark` is a complete set rather than a diff.
 */
export const backgroundColors = {
  light: {
    white: '#ffffff',
    primarySoft: '#ffffff',
    primary: '#ffffff',
    primaryMedium: '#ffffff',
    primaryStrong: '#ffffff',
    secondarySoft: '#f9fafb',
    secondary: '#f9fafb',
    secondaryMedium: '#f9fafb',
    secondaryStrong: '#f9fafb',
    tertiarySoft: '#f3f4f6',
    tertiary: '#f3f4f6',
    tertiaryMedium: '#f3f4f6',
    quaternary: '#e5e7eb',
    quaternaryMedium: '#e5e7eb',
    gray: '#d1d5dc',
    brandSofter: '#eef6ff',
    brandSoft: '#dbeafe',
    brandMedium: '#bedbff',
    brand: '#1447e6',
    brandStrong: '#193cb8',
    successSoft: '#ecfdf5',
    successMedium: '#d0fae5',
    success: '#007a55',
    successStrong: '#006045',
    dangerSoft: '#fef0f2',
    dangerMedium: '#ffe4e6',
    danger: '#c70036',
    dangerStrong: '#a50036',
    warningSoft: '#fffbeb',
    warningMedium: '#fef3c6',
    warning: '#e17100',
    warningStrong: '#bb4d00',
    darkStrong: '#101828',
    dark: '#1e2939',
    disabled: '#f3f4f6',
    purple: '#ad46ff',
    sky: '#00a6f4',
    teal: '#009689',
    pink: '#e60076',
    cyan: '#00b8db',
    fuchsia: '#c800de',
    indigo: '#4f39f6',
    orange: '#ff8a4c',
    red: '#e7000b',
  },
  dark: {
    white: '#ffffff',
    primarySoft: '#101828',
    primary: '#030712',
    primaryMedium: '#1e2939',
    primaryStrong: '#333e4f',
    secondarySoft: '#101828',
    secondary: '#030712',
    secondaryMedium: '#1e2939',
    secondaryStrong: '#333e4f',
    tertiarySoft: '#101828',
    tertiary: '#1e2939',
    tertiaryMedium: '#333e4f',
    quaternary: '#333e4f',
    quaternaryMedium: '#4a5565',
    gray: '#4a5565',
    brandSofter: '#162455',
    brandSoft: '#162455',
    brandMedium: '#1c398e',
    brand: '#155dfc',
    brandStrong: '#1447e6',
    successSoft: '#002c22',
    successMedium: '#004f3b',
    success: '#009966',
    successStrong: '#007a55',
    dangerSoft: '#4d0218',
    dangerMedium: '#8b0836',
    danger: '#c70036',
    dangerStrong: '#c70036',
    warningSoft: '#461901',
    warningMedium: '#7b3306',
    warning: '#fe9a00',
    warningStrong: '#e17100',
    darkStrong: '#1e2939',
    dark: '#1e2939',
    disabled: '#1e2939',
    purple: '#ad46ff',
    sky: '#00a6f4',
    teal: '#00bba7',
    pink: '#f6339a',
    cyan: '#00b8db',
    fuchsia: '#e12afb',
    indigo: '#615fff',
    orange: '#ff8a4c',
    red: '#ff6467',
  },
} as const;
export type BackgroundColors = typeof backgroundColors;
export type BackgroundColorName = keyof BackgroundColors['light'];


/**
 * Border colors from the Figma "Border color variables" spec
 * (file Pxlc9tI2bzrMBFSHfz41s7, node 1146:2451) — the JS mirror of the
 * `--color-border-*` custom properties in tokens.css. Keep the two in sync.
 *
 * NOTE: the four `warning*` values are unverified — see the comment above the
 * border block in tokens.css.
 *
 * Like the other two sets, `dark` is a complete set rather than a diff.
 */
export const borderColors = {
  light: {
    dark: '#4a5565',
    buffer: '#ffffff',
    bufferMedium: '#ffffff',
    bufferStrong: '#ffffff',
    muted: '#f9fafb',
    lightSubtle: '#f3f4f6',
    light: '#f3f4f6',
    lightMedium: '#f3f4f6',
    baseSoft: '#e5e7eb',
    base: '#e5e7eb',
    baseMedium: '#e5e7eb',
    baseStrong: '#e5e7eb',
    successSubtle: '#a4f4cf',
    success: '#007a55',
    dangerSubtle: '#ffccd3',
    danger: '#c70036',
    warningSubtle: '#e17100',
    warning: '#7b3306',
    brandSubtle: '#bedbff',
    brandLight: '#155dfc',
    brand: '#1447e6',
    purple: '#ad46ff',
    orange: '#ff8a4c',
    darkSubtle: '#1e2939',
  },
  dark: {
    dark: '#4a5565',
    buffer: '#030712',
    bufferMedium: '#101828',
    bufferStrong: '#1e2939',
    muted: '#101828',
    lightSubtle: '#101828',
    light: '#1e2939',
    lightMedium: '#333e4f',
    baseSoft: '#101828',
    base: '#1e2939',
    baseMedium: '#333e4f',
    baseStrong: '#4a5565',
    successSubtle: '#004f3b',
    success: '#009966',
    dangerSubtle: '#8b0836',
    danger: '#ec003f',
    warningSubtle: '#fe9a00',
    warning: '#fe9a00',
    brandSubtle: '#1c398e',
    brandLight: '#155dfc',
    brand: '#2b7fff',
    purple: '#ad46ff',
    orange: '#ff8a4c',
    darkSubtle: '#333e4f',
  },
} as const;
export type BorderColors = typeof borderColors;
export type BorderColorName = keyof BorderColors['light'];


/**
 * Data-visualization categorical palette from the Figma
 * "Data Visualization/Categorical" spec (file Pxlc9tI2bzrMBFSHfz41s7,
 * node 5208:23277) — the JS mirror of `--color-viz-categorical-NN`.
 *
 * Ordered arrays, not keyed objects: the spec requires the colors be applied
 * in sequence ("carefully curated to maximize contrast between neighboring
 * colors"), so index order is meaningful. Index 0 is categorical-01.
 *
 * Limit a chart to 8-10 series; 3-5 is better. Never encode meaning in color
 * alone.
 *
 * CAUTION: distinctness only holds to ~10 categories. `dark` has just 12
 * distinct colors — indices 0/13 and 2/10 are each exact duplicates — and in
 * `light`, indices 5 and 12 are near-identical dark reds (CIE76 dE 7.0). Stay
 * at or below 10 series. See the fuller note in tokens.css.
 */
export const vizCategorical = {
  light: [
    '#7008e7', // 01 violet
    '#00b8db', // 02 cyan
    '#00786f', // 03 teal
    '#c6005c', // 04 pink
    '#ffa2a2', // 05 red
    '#82181a', // 06 red
    '#00a63e', // 07 green
    '#372aac', // 08 blue
    '#f6339a', // 09 magenta
    '#fdc700', // 10 yellow
    '#00bba7', // 11 teal
    '#00d3f2', // 12 cyan
    '#771d1d', // 13 orange
    '#8e51ff', // 14 purple
  ],
  dark: [
    '#a684ff', // 01 violet
    '#00d3f2', // 02 cyan
    '#00d5be', // 03 teal
    '#fb64b6', // 04 pink
    '#ff6467', // 05 red
    '#fef2f2', // 06 red
    '#7bf1a8', // 07 green
    '#615fff', // 08 blue
    '#e60076', // 09 magenta
    '#f0b100', // 10 yellow
    '#00d5be', // 11 teal
    '#00b8db', // 12 cyan
    '#d03801', // 13 orange
    '#a684ff', // 14 purple
  ],
} as const;
export type VizCategorical = typeof vizCategorical;
