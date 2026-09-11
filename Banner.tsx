import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Maps to the Figma "Banner" component set's semantic color treatments
 * (Default/Logo + Button read as `accent`; the classification-style
 * variants — Unclassified/Controlled (CUI)/Confidential/Secret/Top
 * Secret/Top Secret/SCI — are page-specific US-gov classification bars,
 * not a general-purpose reusable variant set, so they are intentionally
 * not reproduced 1:1 here. Their color intent collapses onto the closest
 * semantic status below.
 */
export type BannerVariant = 'neutral' | 'accent' | 'success' | 'danger' | 'warning';

/**
 * A `static` banner sits inline wherever it's rendered; `fixed-top`/
 * `fixed-bottom` pin it to the viewport edge, matching Figma's framing of
 * Banner as "typically fixed to top or bottom of a page". Defaults to
 * `static` so embedding is opt-in and left to the consumer's layout.
 */
export type BannerPosition = 'static' | 'fixed-top' | 'fixed-bottom';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BannerVariant;
  position?: BannerPosition;
  /**
   * Leading icon rendered in a small rounded chip ahead of the message.
   * The consumer supplies the icon (e.g. an inline SVG) — Banner only
   * lays it out, matching the `showIcon` axis in Figma.
   */
  icon?: ReactNode;
  /**
   * Call-to-action content (typically one or more `Button`s) rendered at
   * the trailing edge. These are composed by the consumer, not bespoke
   * sub-components — Banner just reserves the layout slot.
   */
  actions?: ReactNode;
  /** Called when the dismiss button is activated. When provided, a trailing "x" button is rendered. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. */
  dismissLabel?: string;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function CloseIcon() {
  return (
    <svg
      className="dfc-banner__dismiss-icon"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.32268 2.64556C9.51843 2.84033 9.51922 3.15692 9.32445 3.35267L6.70534 5.98493L9.35444 8.64733C9.54921 8.84308 9.54842 9.15966 9.35267 9.35443C9.15692 9.5492 8.84033 9.54841 8.64556 9.35266L6 6.69381L3.35444 9.35266C3.15967 9.54841 2.84308 9.5492 2.64733 9.35443C2.45158 9.15966 2.45079 8.84308 2.64556 8.64733L5.29466 5.98493L2.67555 3.35267C2.48078 3.15692 2.48157 2.84034 2.67732 2.64556C2.87307 2.45079 3.18966 2.45159 3.38443 2.64734L6 5.27604L8.61557 2.64733C8.81035 2.45158 9.12693 2.45079 9.32268 2.64556Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Full-width announcement bar, typically fixed to the top or bottom of a
 * page — distinct from `Alert`, which is an inline contextual message.
 * The message is passed as `children`; any CTAs are consumer-composed
 * `children`-like content passed via `actions` (e.g. a `Button`).
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    variant = 'neutral',
    position = 'static',
    icon,
    actions,
    onDismiss,
    dismissLabel = 'Dismiss',
    className,
    children,
    role = 'region',
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      role={role}
      className={cx(
        'dfc-banner',
        `dfc-banner--${variant}`,
        position !== 'static' && `dfc-banner--${position}`,
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className="dfc-banner__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="dfc-banner__content">{children}</div>
      {actions && <div className="dfc-banner__actions">{actions}</div>}
      {onDismiss && (
        <button
          type="button"
          className="dfc-banner__dismiss"
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});
