import { forwardRef, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Maps 1:1 to the Figma "Dropdown header" component set's `Type` axis
 * (node 1149:39866), kebab-cased. Unlike the list item this set has no
 * `State` axis — a header is not interactive.
 */
export type DropdownHeaderType =
  | 'text-helper'
  | 'with-avatar'
  | 'selector'
  | 'big-avatar'
  | 'form';

export interface DropdownHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  type?: DropdownHeaderType;
  /** Primary line — the person's name, or the greeting for `big-avatar`. */
  text?: ReactNode;
  /** Secondary line, typically the email address. */
  secondaryText?: ReactNode;
  /** Avatar slot for `with-avatar`, `selector` and `big-avatar` (compose an `Avatar`). */
  avatar?: ReactNode;
  /**
   * Badge content for `with-avatar` — e.g. `"PRO"`. This is the badge's TEXT,
   * not a `Badge` element: the wrapper already carries the brand-tinted
   * treatment the design draws, so passing a `Badge` would double up.
   */
  badge?: ReactNode;
  /** Trailing content under `big-avatar` — the design places a `Button` here. */
  actions?: ReactNode;
  /** Trailing glyph for `selector`. Defaults to the chevron-sort the design uses. */
  trailingIcon?: ReactNode;
  /** Leading glyph inside the `form` search field. Defaults to a search glyph. */
  searchIcon?: ReactNode;
  /** Placeholder for the `form` search field. */
  placeholder?: string;
  /** Value of the `form` search field. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** chevron-sort, inlined from icons/chevron-sort.svg. */
function ChevronSortIcon() {
  return (
    <svg
      className="dfc-ddh__glyph"
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
        d="M7.5286 2.86193C7.78894 2.60158 8.21105 2.60158 8.4714 2.86193L11.1381 5.5286C11.3984 5.78895 11.3984 6.21106 11.1381 6.4714C10.8777 6.73175 10.4556 6.73175 10.1953 6.4714L8 4.27614L5.80474 6.4714C5.54439 6.73175 5.12228 6.73175 4.86193 6.4714C4.60158 6.21106 4.60158 5.78895 4.86193 5.5286L7.5286 2.86193ZM4.86193 9.5286C5.12228 9.26825 5.54439 9.26825 5.80474 9.5286L8 11.7239L10.1953 9.5286C10.4556 9.26825 10.8777 9.26825 11.1381 9.5286C11.3984 9.78895 11.3984 10.2111 11.1381 10.4714L8.4714 13.1381C8.21105 13.3984 7.78894 13.3984 7.5286 13.1381L4.86193 10.4714C4.60158 10.2111 4.60158 9.78895 4.86193 9.5286Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** search, inlined from icons/search.svg. */
function SearchIcon() {
  return (
    <svg
      className="dfc-ddh__glyph"
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
        d="M6.66667 2.66667C4.45753 2.66667 2.66667 4.45753 2.66667 6.66667C2.66667 8.87581 4.45753 10.6667 6.66667 10.6667C8.87581 10.6667 10.6667 8.87581 10.6667 6.66667C10.6667 4.45753 8.87581 2.66667 6.66667 2.66667ZM1.33333 6.66667C1.33333 3.72115 3.72115 1.33333 6.66667 1.33333C9.61218 1.33333 12 3.72115 12 6.66667C12 9.61218 9.61218 12 6.66667 12C3.72115 12 1.33333 9.61218 1.33333 6.66667ZM11.1953 11.1953C11.4556 10.9349 11.8777 10.9349 12.1381 11.1953L14.4714 13.5286C14.7318 13.7889 14.7318 14.2111 14.4714 14.4714C14.2111 14.7318 13.7889 14.7318 13.5286 14.4714L11.1953 12.1381C10.9349 11.8777 10.9349 11.4556 11.1953 11.1953Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The non-interactive row that sits above a list of `DropdownListItem`s —
 * the five layouts of the Figma "Dropdown header" component set.
 *
 * Like `DropdownListItem`, it is painted from the `--color-*` token families
 * in tokens.css, so it follows light/dark automatically.
 */
export const DropdownHeader = forwardRef<HTMLDivElement, DropdownHeaderProps>(
  function DropdownHeader(
    {
      type = 'text-helper',
      text,
      secondaryText,
      avatar,
      badge,
      actions,
      trailingIcon,
      searchIcon,
      placeholder = 'Search',
      value,
      defaultValue,
      onValueChange,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const searchId = useId();

    const title = text != null && <span className="dfc-ddh__title">{text}</span>;
    const helper = secondaryText != null && (
      <span className="dfc-ddh__helper">{secondaryText}</span>
    );

    let body: ReactNode;

    switch (type) {
      case 'with-avatar':
      case 'selector':
        body = (
          <>
            <span className="dfc-ddh__person">
              {avatar}
              <span className="dfc-ddh__person-text">
                {title}
                {helper}
              </span>
            </span>
            {type === 'with-avatar'
              ? badge != null && <span className="dfc-ddh__badge">{badge}</span>
              : (trailingIcon ?? <ChevronSortIcon />)}
          </>
        );
        break;

      case 'big-avatar':
        body = (
          <>
            <span className="dfc-ddh__stack">
              {avatar}
              <span className="dfc-ddh__stack-text">
                {title}
                {helper}
              </span>
            </span>
            {actions}
          </>
        );
        break;

      case 'form':
        body = (
          <span className="dfc-ddh__field">
            {searchIcon ?? <SearchIcon />}
            <input
              id={searchId}
              type="search"
              className="dfc-ddh__input"
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              onChange={(event) => onValueChange?.(event.currentTarget.value)}
              aria-label={placeholder}
            />
          </span>
        );
        break;

      default:
        body = (
          <>
            {title}
            {helper}
          </>
        );
        break;
    }

    return (
      <div ref={ref} className={cx('dfc-ddh', `dfc-ddh--${type}`, className)} {...rest}>
        {body}
        {children}
      </div>
    );
  },
);
