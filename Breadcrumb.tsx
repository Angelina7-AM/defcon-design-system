import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes } from 'react';

export type BreadcrumbSize = 'sm' | 'md';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Accessible label for the nav landmark. */
  'aria-label'?: string;
  size?: BreadcrumbSize;
}

export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** Destination for the crumb. Omit for the current/last page — it renders as plain text. */
  href?: string;
  /** Extra props forwarded to the rendered `<a>` when `href` is given. */
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  /** Hide the trailing separator (the last crumb in a list should do this). */
  hideSeparator?: boolean;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function ChevronRightIcon() {
  return (
    <svg
      className="dfc-breadcrumb-item__separator-icon"
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
        d="M9.74581 6.58752C9.97362 6.81533 9.97362 7.18467 9.74581 7.41248L5.66248 11.4958C5.43467 11.7236 5.06533 11.7236 4.83752 11.4958C4.60972 11.268 4.60972 10.8987 4.83752 10.6709L8.50838 7L4.83752 3.32915C4.60972 3.10134 4.60972 2.73199 4.83752 2.50419C5.06533 2.27638 5.43467 2.27638 5.66248 2.50419L9.74581 6.58752Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Ordered trail of ancestor pages — `<nav><ol>` wrapper. Compose with `BreadcrumbItem` children. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { size = 'md', className, children, 'aria-label': ariaLabel = 'Breadcrumb', ...rest },
  ref,
) {
  return (
    <nav ref={ref} aria-label={ariaLabel} className={cx('dfc-breadcrumb', className)} {...rest}>
      <ol className={cx('dfc-breadcrumb__list', `dfc-breadcrumb__list--${size}`)}>{children}</ol>
    </nav>
  );
});

/**
 * A single crumb. Renders an `<a>` when `href` is given, or a plain
 * `<span aria-current="page">` for the current/last page when it is not.
 */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem(
    { href, linkProps, hideSeparator = false, className, children, ...rest },
    ref,
  ) {
    const isCurrent = href === undefined;

    return (
      <li
        ref={ref}
        className={cx(
          'dfc-breadcrumb-item',
          isCurrent && 'dfc-breadcrumb-item--current',
          className,
        )}
        {...rest}
      >
        {isCurrent ? (
          <span className="dfc-breadcrumb-item__label" aria-current="page">
            {children}
          </span>
        ) : (
          <a className="dfc-breadcrumb-item__label" href={href} {...linkProps}>
            {children}
          </a>
        )}
        {!hideSeparator && <ChevronRightIcon />}
      </li>
    );
  },
);
