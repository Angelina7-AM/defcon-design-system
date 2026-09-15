import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Checkbox } from './Checkbox';
import type { CheckboxVariant } from './Checkbox';

/**
 * Maps 1:1 to the Figma "Dropdown list item" component set's `Type` axis
 * (node 1149:39651), kebab-cased. Figma's `State` axis (Initial/Hover/
 * Disabled) is NOT a prop: hover is a real CSS `:hover` and disabled is the
 * `disabled` prop, so the single component covers all 51 variants.
 */
export type DropdownListItemType =
  | 'default'
  | 'secondary-text'
  | 'two-icons'
  | 'multiple-icons'
  | 'left-form'
  | 'right-form'
  | 'form-dot'
  | 'form-icons'
  | 'avatar-form'
  | 'only-form'
  | 'badge'
  | 'user-select'
  | 'boxed'
  | 'icon-shapes'
  | 'flag'
  | 'checkbox-icon'
  | 'flag-checkbox';

/**
 * Row tone. `danger` paints the label with --color-text-fg-danger, matching the
 * destructive rows the Dropdown menu compositions use (e.g. "Sign out").
 */
export type DropdownListItemTone = 'default' | 'danger';

/** Types that render a checkbox/radio/toggle, and so wrap in a `<label>`. */
const FORM_TYPES = new Set<DropdownListItemType>([
  'left-form',
  'right-form',
  'form-dot',
  'form-icons',
  'avatar-form',
  'only-form',
  'checkbox-icon',
  'flag-checkbox',
]);

export interface DropdownListItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  type?: DropdownListItemType;
  /** `danger` marks the row destructive. Defaults to `default`. */
  tone?: DropdownListItemTone;
  /** Primary label. For `user-select` this is the person's name. */
  text?: ReactNode;
  /**
   * The second piece of text. Its role varies by type: a trailing muted count
   * for `secondary-text`/`left-form`/`form-dot`/`checkbox-icon`, the email for
   * `user-select`, and the helper line under the label for `only-form`.
   */
  secondaryText?: ReactNode;
  /** Leading glyph. Rendered inside the circular chip for `icon-shapes`. */
  leftIcon?: ReactNode;
  /** Single trailing glyph, for `two-icons`. */
  rightIcon?: ReactNode;
  /**
   * A group of glyphs — the trailing row for `multiple-icons`, or the star
   * rating for `form-icons`. Pass a fragment of icons.
   */
  icons?: ReactNode;
  /** Trailing badge, for `badge` and `user-select` (compose a `Badge`). */
  badge?: ReactNode;
  /** Leading avatar, for `avatar-form` and `user-select` (compose an `Avatar`). */
  avatar?: ReactNode;
  /**
   * Country flag for the `flag` and `flag-checkbox` types. Flags are data, so
   * the consumer supplies one; the flag the design draws is exported to
   * `icons/flag-es.svg`.
   */
  flag?: ReactNode;
  /** Color of the dot in `form-dot`. Defaults to the spec's purple. */
  dotColor?: string;
  /** Which control the `*-form` types render. `right-form` defaults to `toggle`. */
  control?: CheckboxVariant;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * A single row inside a dropdown/menu surface — the seventeen layouts of the
 * Figma "Dropdown list item" component set.
 *
 * Painted entirely from the `--color-text-*`, `--color-bg-*` and
 * `--color-border-*` token families in tokens.css (the same ones the Figma
 * spec pages define), so it follows light/dark automatically.
 *
 * Icons, avatars, badges and flags are consumer-supplied slots, matching the
 * instance-swap properties in Figma — this component only lays them out.
 */
export const DropdownListItem = forwardRef<HTMLDivElement, DropdownListItemProps>(
  function DropdownListItem(
    {
      type = 'default',
      tone = 'default',
      text,
      secondaryText,
      leftIcon,
      rightIcon,
      icons,
      badge,
      avatar,
      flag,
      dotColor,
      control,
      checked,
      defaultChecked,
      onCheckedChange,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const isForm = FORM_TYPES.has(type);
    const controlVariant: CheckboxVariant = control ?? (type === 'right-form' ? 'toggle' : 'checkbox');

    const rootClass = cx(
      'dfc-ddli',
      `dfc-ddli--${type}`,
      tone !== 'default' && `dfc-ddli--${tone}`,
      disabled && 'is-disabled',
      className,
    );

    const formControl = (
      <Checkbox
        variant={controlVariant}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
      />
    );

    const label = text != null && <span className="dfc-ddli__text">{text}</span>;
    const secondary = secondaryText != null && (
      <span className="dfc-ddli__secondary">{secondaryText}</span>
    );

    // `only-form` delegates its whole body to the labelled Checkbox, so it must
    // not be wrapped in another <label>.
    if (type === 'only-form') {
      return (
        <div ref={ref} className={rootClass} {...rest}>
          <Checkbox
            variant={controlVariant}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
            label={text}
            helperText={secondaryText}
          />
          {children}
        </div>
      );
    }

    let lead: ReactNode;
    let trail: ReactNode;

    switch (type) {
      case 'secondary-text':
        lead = (
          <>
            {leftIcon}
            {label}
          </>
        );
        trail = secondary;
        break;
      case 'two-icons':
        lead = (
          <>
            {leftIcon}
            {label}
          </>
        );
        trail = rightIcon;
        break;
      case 'multiple-icons':
        lead = (
          <>
            {leftIcon}
            {label}
          </>
        );
        trail = icons && <span className="dfc-ddli__icons">{icons}</span>;
        break;
      case 'left-form':
        lead = (
          <>
            {formControl}
            {label}
          </>
        );
        trail = secondary;
        break;
      case 'right-form':
        lead = (
          <>
            {leftIcon}
            {label}
          </>
        );
        trail = formControl;
        break;
      case 'form-dot':
        lead = (
          <>
            {formControl}
            <span
              className="dfc-ddli__dot"
              style={dotColor ? { background: dotColor } : undefined}
              aria-hidden="true"
            />
            {label}
          </>
        );
        trail = secondary;
        break;
      case 'form-icons':
        lead = (
          <>
            {formControl}
            {icons && <span className="dfc-ddli__icons">{icons}</span>}
          </>
        );
        break;
      case 'avatar-form':
        lead = (
          <>
            {avatar}
            {label}
          </>
        );
        trail = formControl;
        break;
      case 'badge':
        lead = (
          <>
            {leftIcon}
            {label}
          </>
        );
        trail = badge;
        break;
      case 'user-select':
        lead = (
          <>
            {avatar}
            <span className="dfc-ddli__person">
              {label}
              {secondary}
            </span>
          </>
        );
        trail = badge;
        break;
      case 'boxed':
        lead = (
          <>
            {leftIcon}
            {label}
          </>
        );
        break;
      case 'icon-shapes':
        lead = (
          <>
            {leftIcon && <span className="dfc-ddli__icon-shape">{leftIcon}</span>}
            {label}
          </>
        );
        break;
      case 'flag':
        lead = (
          <>
            {flag && <span className="dfc-ddli__flag">{flag}</span>}
            {label}
          </>
        );
        break;
      case 'checkbox-icon':
        lead = (
          <>
            {formControl}
            {leftIcon}
            {label}
          </>
        );
        trail = secondary;
        break;
      case 'flag-checkbox':
        lead = (
          <>
            {formControl}
            {flag && <span className="dfc-ddli__flag">{flag}</span>}
            {label}
          </>
        );
        break;
      default:
        lead = (
          <>
            {leftIcon}
            {label}
          </>
        );
        break;
    }

    const body = (
      <>
        <span className="dfc-ddli__lead">{lead}</span>
        {trail != null && trail !== false && <span className="dfc-ddli__trail">{trail}</span>}
        {children}
      </>
    );

    if (isForm) {
      // A <label> makes the whole row toggle the control natively.
      return (
        <label
          ref={ref as unknown as Ref<HTMLLabelElement>}
          className={rootClass}
          {...(rest as HTMLAttributes<HTMLLabelElement>)}
        >
          {body}
        </label>
      );
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        className={rootClass}
        {...rest}
      >
        {body}
      </div>
    );
  },
);
