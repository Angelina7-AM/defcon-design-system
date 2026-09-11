import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

export type CardOrientation = 'vertical' | 'horizontal';
export type CardStatusTone = 'neutral' | 'accent' | 'success' | 'danger' | 'warning';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual/media slot rendered at the leading edge of the card (an `<img>`,
   * a placeholder graphic, etc). Matches the Figma "With Image"/"Split"
   * variants' image region — the actual asset is always consumer-supplied
   * (e.g. `<img src={...} />`), never a hardcoded demo image.
   */
  media?: ReactNode;
  /**
   * Header region — typically a heading plus an optional trailing icon or
   * helper text, mirroring the "Heading and Icon" part seen across every
   * Figma "Card" variant. Left as a free-form slot rather than individual
   * `title`/`icon` props because the variants combine them too differently
   * (help icons, badges, required markers, helper text) to model faithfully
   * as a fixed prop shape — consumers compose their own heading markup.
   */
  header?: ReactNode;
  /** Footer/actions region — e.g. a `Button`, matches the trailing CTA seen in most Card variants. */
  footer?: ReactNode;
  /**
   * `vertical` (default) stacks media/header/body/footer top-to-bottom, as
   * in the "Default"/"With Image" Figma variants. `horizontal` places
   * `media` beside the content column, as in the "Split" variant.
   */
  orientation?: CardOrientation;
  /**
   * Marks the body region as an independently scrollable area with the
   * design system's custom (thin, gold-thumb) scrollbar treatment, matching
   * the Figma "Scrollbar" component's styling of a scrollable region. Set a
   * `max-height`/`height` via `style`/`className` on the card (or body) for
   * this to have a visible effect.
   */
  scrollable?: boolean;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Flexible content container — an off-black surface with optional
 * media/header/footer slots around a free-form body (`children`). Composes
 * the Figma "Card" component set's many `Type` variants (Default, With
 * Image, Split, CTA card, etc.) into slots rather than one prop per
 * variant, since the variants mostly differ in *which* regions are present,
 * not in how each region behaves.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    media,
    header,
    footer,
    orientation = 'vertical',
    scrollable = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('dfc-card', `dfc-card--${orientation}`, className)}
      {...rest}
    >
      {media && <div className="dfc-card__media">{media}</div>}
      <div className="dfc-card__content">
        {header && <div className="dfc-card__header">{header}</div>}
        {children != null && (
          <div className={cx('dfc-card__body', scrollable && 'dfc-card__body--scrollable')}>
            {children}
          </div>
        )}
        {footer && <div className="dfc-card__footer">{footer}</div>}
      </div>
    </div>
  );
});

export interface CardStatusProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic tone driving the dot color — reuses the Badge/Avatar tone palette. */
  tone?: CardStatusTone;
  /** Hide the leading dot, e.g. when the label alone is sufficient. */
  hideDot?: boolean;
}

/**
 * Small inline status indicator (colored dot + label) used inside a `Card`
 * or `CardRow`, e.g. the "Priority Status" / "Active" part of the Figma
 * "Status" component. The Figma source renders a fixed green dot + "Active"
 * text; here the color is generalized to a `tone` so the same part can
 * represent any status rather than only "Active".
 */
export const CardStatus = forwardRef<HTMLSpanElement, CardStatusProps>(function CardStatus(
  { tone = 'success', hideDot = false, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx('dfc-card-status', className)} {...rest}>
      {!hideDot && (
        <span className={cx('dfc-card-status__dot', `dfc-card-status__dot--${tone}`)} aria-hidden="true" />
      )}
      <span className="dfc-card-status__label">{children}</span>
    </span>
  );
});

export interface CardRowStatProps extends HTMLAttributes<HTMLDivElement> {
  /** Primary value, e.g. "Text" in the Figma reference (a stat's headline). */
  value: ReactNode;
  /** Secondary line under the value, e.g. "Subtext" in the Figma reference. */
  subtext?: ReactNode;
}

/** A single title/value stat column within a `CardRow`'s content group. */
export const CardRowStat = forwardRef<HTMLDivElement, CardRowStatProps>(function CardRowStat(
  { value, subtext, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('dfc-card-row__stat', className)} {...rest}>
      <p className="dfc-card-row__stat-value">{value}</p>
      {subtext != null && <p className="dfc-card-row__stat-subtext">{subtext}</p>}
    </div>
  );
});

export interface CardRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Row heading, e.g. "Title" in the Figma reference. */
  title: ReactNode;
  /** Secondary line under the title, e.g. "Subtext" in the Figma reference. */
  subtext?: ReactNode;
  /** Icon rendered before `title`. */
  icon?: ReactNode;
  /** `CardRowStat` elements (or other content) rendered in the middle content group. */
  children?: ReactNode;
  /** Trailing slot — typically a `CardStatus`, matching the "Priority Status" end column. */
  endContent?: ReactNode;
  /** Accessible label shown above `endContent`, e.g. "Priority Status". */
  endLabel?: ReactNode;
}

/**
 * Row/list-item layout for tabular card content — a left-accented strip
 * with a title/subtext column, a flexible run of stat columns
 * (`CardRowStat` children), and an optional trailing status column. Ports
 * the Figma "Custom Card Row" component set's `Default` variant; the
 * set's `Label` variant (a form-field-style label/helper-text header above
 * the row) is deliberately NOT ported here — it duplicates form-label
 * concerns that belong to a future Field/FormRow component, not Card.
 */
export const CardRow = forwardRef<HTMLDivElement, CardRowProps>(function CardRow(
  { title, subtext, icon, children, endContent, endLabel, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('dfc-card-row', className)} {...rest}>
      <div className="dfc-card-row__title">
        <div className="dfc-card-row__heading">
          {icon && (
            <span className="dfc-card-row__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <p className="dfc-card-row__heading-text">{title}</p>
        </div>
        {subtext != null && <p className="dfc-card-row__subtext">{subtext}</p>}
      </div>
      {children != null && <div className="dfc-card-row__stats">{children}</div>}
      {endContent != null && (
        <div className="dfc-card-row__end">
          {endLabel != null && <p className="dfc-card-row__end-label">{endLabel}</p>}
          {endContent}
        </div>
      )}
    </div>
  );
});
