import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Maps 1:1 to Figma's "Alert" component set `Color` axis (Default, Info,
 * Success, Warning, Danger) — `neutral` is our existing naming convention
 * for Figma's "Default".
 */
export type AlertVariant = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  /**
   * Optional heading rendered above the body content, matching Figma's
   * "Complex" `Type` variant (icon + heading row, body text below). When
   * omitted, Alert renders the flat single-line layout matching Figma's
   * "Default"/"Border top" `Type` variants (icon + body text inline).
   *
   * Named `heading` (not `title`) to avoid colliding with the native
   * `title` HTML attribute (tooltip text), which is still forwarded via
   * `...rest` as usual.
   */
  heading?: ReactNode;
  /**
   * Renders a colored accent strip along the top edge, matching Figma's
   * "Border top" `Type` variant. Pairs with any `variant`.
   */
  accent?: boolean;
  /** Leading status icon. Defaults to a severity-appropriate info-circle glyph. Set to `null` to omit. */
  icon?: ReactNode | null;
  /** Called when the dismiss button is activated. When provided, a trailing close button is rendered. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. */
  dismissLabel?: string;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Default severity icon — a filled info-circle glyph shared across all
 * variants (color comes from `currentColor`, set per-variant in CSS).
 * Source asset: icons/alert-info-circle.svg.
 */
function InfoCircleIcon() {
  return (
    <svg
      className="dfc-alert__icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2.66667C5.05448 2.66667 2.66667 5.05448 2.66667 8C2.66667 10.9455 5.05448 13.3333 8 13.3333C10.9455 13.3333 13.3333 10.9455 13.3333 8C13.3333 5.05448 10.9455 2.66667 8 2.66667ZM1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8ZM6.9386 5C6.9386 4.63181 7.23708 4.33333 7.60526 4.33333H7.61193C7.98012 4.33333 8.2786 4.63181 8.2786 5C8.2786 5.36819 7.98012 5.66667 7.61193 5.66667H7.60526C7.23708 5.66667 6.9386 5.36819 6.9386 5ZM6 7.33333C6 6.96514 6.29848 6.66667 6.66667 6.66667H8C8.36819 6.66667 8.66667 6.96514 8.66667 7.33333V10H9.33333C9.70152 10 10 10.2985 10 10.6667C10 11.0349 9.70152 11.3333 9.33333 11.3333H6.66667C6.29848 11.3333 6 11.0349 6 10.6667C6 10.2985 6.29848 10 6.66667 10H7.33333V8H6.66667C6.29848 8 6 7.70152 6 7.33333Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Dismiss ("x") glyph — intentional reuse of the same structural close icon
 * already inlined in Badge.tsx (icons/close.svg), not a new asset.
 */
function CloseIcon() {
  return (
    <svg
      className="dfc-alert__icon"
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
 * Status/notification banner — theme-colored surface with an optional
 * leading severity icon, optional heading, body content, and dismiss
 * action. Actions (buttons/links) are composed by the consumer via
 * `children`, e.g. placing a `Button` after the message text.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = 'neutral',
    heading,
    accent = false,
    icon,
    onDismiss,
    dismissLabel = 'Dismiss',
    className,
    children,
    ...rest
  },
  ref,
) {
  const showIcon = icon !== null;

  return (
    <div
      ref={ref}
      role="alert"
      className={cx(
        'dfc-alert',
        `dfc-alert--${variant}`,
        accent && 'dfc-alert--accent',
        heading != null && 'dfc-alert--complex',
        className,
      )}
      {...rest}
    >
      {showIcon && (
        <span className="dfc-alert__icon-slot" aria-hidden="true">
          {icon ?? <InfoCircleIcon />}
        </span>
      )}
      <div className="dfc-alert__content">
        {heading != null && <div className="dfc-alert__title">{heading}</div>}
        {children != null && <div className="dfc-alert__body">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="dfc-alert__dismiss"
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});
