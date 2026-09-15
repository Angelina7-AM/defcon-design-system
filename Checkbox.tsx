import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * The three form controls drawn in Figma's "Checkbox input" and "Toggle
 * switches" layers. `checkbox` and `radio` share the same 16px box and differ
 * only in corner radius and checked glyph; `toggle` is the 36x20 pill with a
 * 16px knob.
 */
export type CheckboxVariant = 'checkbox' | 'radio' | 'toggle';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  variant?: CheckboxVariant;
  /**
   * Text beside the control. When omitted the control renders on its own,
   * which is how the dropdown list item's inline `form` types use it.
   */
  label?: ReactNode;
  /** Secondary line under the label, matching Figma's "Helper (checkbox&radio)" layer. */
  helperText?: ReactNode;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Checkmark drawn inside a checked `checkbox`, inlined from the exported
 * icons/check.svg (the Dropdown menu "With scroll"/"Users" compositions are
 * where the design draws the checked state).
 */
function CheckGlyph() {
  return (
    <svg
      className="dfc-checkbox__glyph"
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
        d="M13.1451 4.53577C13.4015 4.80002 13.3952 5.22208 13.1309 5.47847L6.9469 11.4785C6.68828 11.7294 6.27709 11.7294 6.01846 11.4785L2.86912 8.42316C2.60486 8.16678 2.59847 7.74472 2.85484 7.48046C3.11122 7.21619 3.53328 7.2098 3.79754 7.46618L6.48264 10.0711L12.2024 4.52153C12.4667 4.26514 12.8887 4.27152 13.1451 4.53577Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Checkbox, radio and toggle in one control, matching the Figma
 * "Checkbox input" / "Toggle switches" layers used across the Dropdown list
 * item component set.
 *
 * Renders a real `<input>` so it stays keyboard accessible and form-associable;
 * the visual box is a sibling span painted from the `--color-bg-*` and
 * `--color-border-*` tokens in tokens.css. When `label` is supplied the whole
 * thing is wrapped in a `<label>` so clicking the text toggles the control.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { variant = 'checkbox', label, helperText, className, disabled, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputType = variant === 'radio' ? 'radio' : 'checkbox';

  const control = (
    <span className="dfc-checkbox__control" aria-hidden="true">
      {variant === 'checkbox' && <CheckGlyph />}
      {variant === 'toggle' && <span className="dfc-checkbox__knob" />}
    </span>
  );

  const input = (
    <input
      ref={ref}
      id={inputId}
      type={inputType}
      className="dfc-checkbox__input"
      disabled={disabled}
      {...rest}
    />
  );

  if (label == null && helperText == null) {
    return (
      <span
        className={cx('dfc-checkbox', `dfc-checkbox--${variant}`, disabled && 'is-disabled', className)}
      >
        {input}
        {control}
      </span>
    );
  }

  return (
    <label
      htmlFor={inputId}
      className={cx(
        'dfc-checkbox',
        'dfc-checkbox--labelled',
        `dfc-checkbox--${variant}`,
        disabled && 'is-disabled',
        className,
      )}
    >
      {input}
      {control}
      <span className="dfc-checkbox__text">
        {label != null && <span className="dfc-checkbox__label">{label}</span>}
        {helperText != null && <span className="dfc-checkbox__helper">{helperText}</span>}
      </span>
    </label>
  );
});
