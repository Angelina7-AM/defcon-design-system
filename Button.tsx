import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

/**
 * `primary`/`secondary`/`ghost` are the original DFC variants and remain the
 * default palette. `success`/`danger`/`warning`/`dark`/`tertiary` were added
 * to reconcile with the Figma "Button" component set's `Color` axis (Brand,
 * Secondary, Success, Danger, Warning, Dark, Tertiary, Ghost) — `primary` is
 * our existing name for Figma's "Brand".
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'success'
  | 'danger'
  | 'warning'
  | 'dark'
  | 'tertiary';

/**
 * `sm`/`md`/`lg` are the original DFC sizes and keep their existing class
 * names/behavior. `xs` and `xl` were added to reconcile with the Figma
 * `Size` axis (xs, sm, base, l, xl) — `md` is our existing name for Figma's
 * "base" and `lg` for Figma's "l".
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Renders the outlined treatment for the current `variant` — a
   * transparent/tinted fill with a colored border and matching text,
   * matching Figma's `Outline=True` axis. Falls back to the filled style
   * when omitted.
   */
  outline?: boolean;
  /**
   * Renders a square, icon-only button (equal padding on all sides, no
   * text/gap), matching Figma's `Icon only=True` axis. The consumer is
   * responsible for passing the icon itself via `children` — this prop
   * only changes layout/sizing, it never renders an icon on its own.
   */
  iconOnly?: boolean;
  /**
   * Shows an inline loading spinner and marks the button busy/disabled.
   * NOTE: the Figma "Button" component set's `State` axis only defines
   * Initial/Hover/Focus/Disabled — there is no explicit Loading variant in
   * the source of truth today. This prop is added speculatively for the
   * common async-action pattern already implied by Disabled; drop it (or
   * confirm it) once Figma adds a real Loading state. The spinner is a
   * pure-CSS element (no icon asset), since it's intrinsic to the button's
   * own state rather than consumer-supplied content.
   */
  loading?: boolean;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    outline = false,
    iconOnly = false,
    loading = false,
    className,
    type = 'button',
    disabled,
    'aria-busy': ariaBusy,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || ariaBusy}
      className={cx(
        'dfc-button',
        `dfc-button--${variant}`,
        `dfc-button--${size}`,
        outline && 'dfc-button--outline',
        iconOnly && 'dfc-button--icon-only',
        loading && 'dfc-button--loading',
        className,
      )}
      {...rest}
    >
      {loading && <span className="dfc-button__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});
