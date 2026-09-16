import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export type BadgeVariant = 'neutral' | 'subtle' | 'accent' | 'danger' | 'warning' | 'success';
export type BadgeSize = 'sm' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Render a leading status dot instead of `leftIcon`. Takes precedence over `leftIcon`/`loading`. */
  dot?: boolean;
  /** Render a leading spinner instead of `leftIcon`, indicating an in-flight state. */
  loading?: boolean;
  /** Icon rendered before the label. Ignored when `dot` or `loading` is set. */
  leftIcon?: React.ReactNode;
  /** Secondary label shown after the primary label, separated by a hairline. */
  secondaryText?: React.ReactNode;
  /** Collapse the badge to just its icon/dot/loader — no label. */
  iconOnly?: boolean;
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
      className="dfc-badge__icon"
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

function LoaderIcon() {
  return (
    <svg
      className="dfc-badge__icon dfc-badge__loader"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 3.87546e-07 6 3.87546e-07C9.31371 3.87546e-07 12 2.68629 12 6ZM1.8 6C1.8 8.3196 3.6804 10.2 6 10.2C8.3196 10.2 10.2 8.3196 10.2 6C10.2 3.6804 8.3196 1.8 6 1.8C3.6804 1.8 1.8 3.6804 1.8 6Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M11.0551 6.67556C11.5477 6.7414 12.0076 6.3941 11.9991 5.89712C11.9881 5.25529 11.8741 4.6174 11.6598 4.00821C11.3454 3.11505 10.8242 2.30895 10.1386 1.65583C9.45307 1.00271 8.62267 0.52112 7.71533 0.250423C7.09648 0.0657942 6.45381 -0.0171509 5.81221 0.00293917C5.31539 0.0184954 4.99077 0.494685 5.0804 0.983594C5.17003 1.4725 5.64171 1.78589 6.1385 1.80228C6.4973 1.81412 6.85434 1.87196 7.20073 1.9753C7.83587 2.16478 8.41715 2.5019 8.89704 2.95908C9.37692 3.41627 9.7418 3.98053 9.96183 4.60575C10.0818 4.94673 10.1569 5.30055 10.1861 5.65835C10.2265 6.15376 10.5624 6.60972 11.0551 6.67556Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Compact status/tag pill — theme-colored surface with an optional leading icon/dot/loader and dismiss action. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = 'neutral',
    size = 'sm',
    dot = false,
    loading = false,
    leftIcon,
    secondaryText,
    iconOnly = false,
    onDismiss,
    dismissLabel = 'Remove',
    className,
    children,
    ...rest
  },
  ref,
) {
  const showLeading = dot || loading || Boolean(leftIcon);

  return (
    <span
      ref={ref}
      className={cx(
        'dfc-badge',
        `dfc-badge--${variant}`,
        `dfc-badge--${size}`,
        iconOnly && 'dfc-badge--icon-only',
        className,
      )}
      {...rest}
    >
      {dot ? (
        <span className="dfc-badge__dot" aria-hidden="true" />
      ) : loading ? (
        <LoaderIcon />
      ) : (
        showLeading && (
          <span className="dfc-badge__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}
      {!iconOnly && children != null && <span className="dfc-badge__label">{children}</span>}
      {!iconOnly && secondaryText != null && (
        <>
          <span className="dfc-badge__separator" aria-hidden="true" />
          <span className="dfc-badge__secondary">{secondaryText}</span>
        </>
      )}
      {onDismiss && (
        <button
          type="button"
          className="dfc-badge__dismiss"
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
});
