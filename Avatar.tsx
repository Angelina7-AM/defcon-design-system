import { forwardRef, isValidElement, cloneElement, Children } from 'react';
import type { HTMLAttributes, ImgHTMLAttributes, ReactElement, ReactNode } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Image URL for the avatar photo. Omit to fall back to initials/children. */
  src?: string;
  /** Alt text for the image. Defaults to empty (decorative) when omitted. */
  alt?: string;
  /** Extra props forwarded to the rendered `<img>` when `src` is given. */
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
  /** Short fallback text (e.g. initials) shown when there is no `src`. Ignored if `children` is given. */
  initials?: string;
  size?: AvatarSize;
  /** Status indicator dot — omit to render no dot. */
  status?: AvatarStatus;
  /** Accessible label for the status dot. Defaults to a capitalized `status`. */
  statusLabel?: string;
  /** Shows a remove/dismiss affordance in the corner of the avatar. */
  removable?: boolean;
  /** Called when the remove button is activated. */
  onRemove?: () => void;
  /** Accessible label for the remove button. */
  removeLabel?: string;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function RemoveIcon() {
  return (
    <svg
      className="dfc-avatar__remove-icon"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8765 3.08649C11.1048 3.31372 11.1058 3.68307 10.8785 3.91144L7.8229 6.98241L10.9135 10.0885C11.1407 10.3169 11.1398 10.6863 10.9114 10.9135C10.6831 11.1407 10.3137 11.1398 10.0865 10.9114L7 7.80945L3.91351 10.9114C3.68628 11.1398 3.31693 11.1407 3.08856 10.9135C2.86018 10.6863 2.85925 10.3169 3.08649 10.0885L6.1771 6.98241L3.12148 3.91145C2.89424 3.68307 2.89517 3.31373 3.12354 3.08649C3.35192 2.85926 3.72126 2.86018 3.9485 3.08856L7 6.15538L10.0515 3.08856C10.2787 2.86018 10.6481 2.85925 10.8765 3.08649Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Circular user avatar. Renders an image when `src` is given, otherwise
 * falls back to `children` or `initials`. Optionally shows a status dot
 * and/or a remove button (used standalone or composed inside `AvatarGroup`).
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    src,
    alt = '',
    imgProps,
    initials,
    size = 'base',
    status,
    statusLabel,
    removable = false,
    onRemove,
    removeLabel = 'Remove',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx('dfc-avatar', `dfc-avatar--${size}`, className)} {...rest}>
      {src ? (
        <img className="dfc-avatar__image" src={src} alt={alt} {...imgProps} />
      ) : (
        <span className="dfc-avatar__fallback" aria-hidden={alt === ''}>
          {children ?? initials}
        </span>
      )}
      {status && (
        <span
          className={cx('dfc-avatar__dot', `dfc-avatar__dot--${status}`)}
          role="img"
          aria-label={statusLabel ?? status[0].toUpperCase() + status.slice(1)}
        />
      )}
      {removable && (
        <button
          type="button"
          className="dfc-avatar__remove"
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <RemoveIcon />
        </button>
      )}
    </div>
  );
});

export type AvatarGroupSize = Extract<AvatarSize, 'sm' | 'base' | 'lg'>;

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** `Avatar` elements to stack. */
  children: ReactNode;
  size?: AvatarGroupSize;
  /** Maximum number of avatars to show before collapsing the rest into a "+N" counter. */
  max?: number;
}

/**
 * Overlapping stack of avatars. Pass `Avatar` elements as children; when there
 * are more than `max`, the remainder are collapsed into a trailing "+N" counter
 * (mirrors the Figma "Avatar group" / "Counter" sub-part).
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { children, size = 'sm', max, className, ...rest },
  ref,
) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const visible = max ? items.slice(0, max) : items;
  const overflow = max ? Math.max(items.length - max, 0) : 0;

  return (
    <div ref={ref} className={cx('dfc-avatar-group', `dfc-avatar-group--${size}`, className)} {...rest}>
      {visible.map((item, index) =>
        cloneElement(item, {
          key: item.key ?? index,
          size,
          className: cx('dfc-avatar-group__item', item.props.className),
        }),
      )}
      {overflow > 0 && (
        <span className={cx('dfc-avatar-group__item', 'dfc-avatar-group__counter')}>
          +{overflow}
        </span>
      )}
    </div>
  );
});

export interface AvatarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Avatar rendered alongside the label. */
  avatar: ReactElement<AvatarProps>;
  /** Primary name/heading text. */
  name: ReactNode;
  /** Secondary helper text (e.g. email) shown under the name. */
  helper?: ReactNode;
  size?: AvatarGroupSize | 'xl';
}

/** An `Avatar` paired with a name (and optional helper text) — for lists, mentions, etc. */
export const AvatarGroupLabel = forwardRef<HTMLDivElement, AvatarGroupLabelProps>(
  function AvatarGroupLabel({ avatar, name, helper, size = 'sm', className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx('dfc-avatar-group-label', `dfc-avatar-group-label--${size}`, className)} {...rest}>
        {cloneElement(avatar, {
          size,
          className: cx('dfc-avatar-group-label__avatar', avatar.props.className),
        })}
        <span className="dfc-avatar-group-label__text">
          <span className="dfc-avatar-group-label__name">{name}</span>
          {helper && <span className="dfc-avatar-group-label__helper">{helper}</span>}
        </span>
      </div>
    );
  },
);
