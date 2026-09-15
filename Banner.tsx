import { forwardRef, useId } from 'react';
import type { FormEventHandler, HTMLAttributes, ReactNode } from 'react';
import { Logo, Wordmark } from './Logo';

/**
 * Maps 1:1 to the Figma "Banner" component set's `Type` axis. The first
 * five are content layouts; the remaining six are US government
 * classification markings, whose colors are prescribed rather than
 * themeable.
 *
 * NOTE: Figma spells the classification variant "Confidental"; the label it
 * renders is "Confidential". The correct spelling is used here for both.
 */
export type BannerType =
  | 'default'
  | 'heading-description'
  | 'icon-link'
  | 'newsletter'
  | 'logo-button'
  | 'unclassified'
  | 'controlled-cui'
  | 'confidential'
  | 'secret'
  | 'top-secret'
  | 'top-secret-sci';

/**
 * A `static` banner sits inline wherever it's rendered; `fixed-top`/
 * `fixed-bottom` pin it to the viewport edge, matching Figma's framing of
 * Banner as "typically fixed to top or bottom of a page". Defaults to
 * `static` so embedding is opt-in and left to the consumer's layout.
 */
export type BannerPosition = 'static' | 'fixed-top' | 'fixed-bottom';

/**
 * The classification markings and the exact label each renders. These
 * strings are the marking itself — they are rendered from the `type`
 * rather than supplied as `children`, though `children` still overrides
 * them when a caller needs a portion marking or caveat.
 */
const CLASSIFICATION_LABELS = {
  unclassified: 'Unclassified',
  'controlled-cui': 'Controlled (CUI)',
  confidential: 'Confidential',
  secret: 'Secret',
  'top-secret': 'Top Secret',
  'top-secret-sci': 'Top Secret/SCI',
} as const;

type ClassificationType = keyof typeof CLASSIFICATION_LABELS;

function isClassification(type: BannerType): type is ClassificationType {
  return type in CLASSIFICATION_LABELS;
}

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /** Which Figma `Type` variant to render. Defaults to `default`. */
  type?: BannerType;
  position?: BannerPosition;
  /**
   * Shows the leading glyph, matching Figma's `showIcon` axis. Applies to
   * the `default` layout and the classification markings; the `icon-link`
   * layout always shows its chip, since the icon is intrinsic to it.
   */
  showIcon?: boolean;
  /**
   * Replaces the default leading glyph (a bullhorn). Only consulted for
   * layouts that render a leading icon.
   */
  icon?: ReactNode;
  /** Heading line for the `heading-description` layout. */
  heading?: ReactNode;
  /**
   * Call-to-action content rendered in Figma's "Buttons" slot (typically
   * one or more `Button`s). Composed by the consumer — Banner only
   * reserves the layout slot.
   */
  actions?: ReactNode;
  /** Trailing link text for the `icon-link` layout. Renders with a trailing arrow. */
  linkLabel?: ReactNode;
  /** Href for `linkLabel`. */
  linkHref?: string;
  /** Field label for the `newsletter` layout. */
  fieldLabel?: ReactNode;
  /** Marks the newsletter field required, rendering the red asterisk from Figma. */
  fieldRequired?: boolean;
  /** Placeholder for the newsletter email input. */
  fieldPlaceholder?: string;
  /**
   * Tooltip text for the question-circle glyph beside the newsletter
   * label. The glyph is omitted when this is not provided.
   */
  fieldHint?: string;
  /** Submit handler for the `newsletter` layout's form. */
  onSubmit?: FormEventHandler<HTMLFormElement>;
  /** Called when the dismiss button is activated. When provided, a trailing "x" button is rendered. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. */
  dismissLabel?: string;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function BullhornIcon() {
  return (
    <svg className="dfc-banner__glyph" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <g>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.5583 2.87715C11.4408 2.2468 12.6667 2.87763 12.6667 3.96213V5.41735C13.8168 5.71337 14.6667 6.75744 14.6667 8C14.6667 9.24256 13.8168 10.2866 12.6667 10.5827V12.0379C12.6667 13.1224 11.4408 13.7532 10.5583 13.1229L7.11969 10.6667H6.66667V13.3333C6.66667 13.7015 6.36819 14 6 14H4C3.63181 14 3.33333 13.7015 3.33333 13.3333V10.6667C2.59695 10.6667 2 10.0697 2 9.33333V6.66667C2 5.93029 2.59695 5.33333 3.33333 5.33333H7.11969L10.5583 2.87715ZM6.66667 6.66667H3.33333V9.33333H6.66667V6.66667ZM8 9.65692L11.3333 12.0379V3.96213L8 6.34308V9.65692ZM12.6667 6.84504V9.15496C13.0652 8.92442 13.3333 8.49352 13.3333 8C13.3333 7.50648 13.0652 7.07558 12.6667 6.84504ZM4.66667 10.6667V12.6667H5.33333V10.6667H4.66667Z" fill="currentColor"/>
      </g>
    </svg>
  );
}

function SalePercentIcon() {
  return (
    <svg className="dfc-banner__glyph" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" focusable="false">
      <g clipPath="url(#clip0_0_742)">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.28683 1.8009C5.09855 1.61164 4.85236 1.64754 4.71444 1.79334C4.71203 1.79589 4.70958 1.79841 4.70711 1.8009L4.33515 2.17477C4.33514 2.17479 4.33517 2.17476 4.33515 2.17477C4.10205 2.40913 3.78584 2.54087 3.45615 2.54094H2.93029C2.82154 2.54094 2.71725 2.58437 2.64035 2.66166C2.56345 2.73896 2.52025 2.84379 2.52025 2.95311V3.48159C2.52018 3.81298 2.38916 4.13087 2.15601 4.36518C2.15599 4.3652 2.15602 4.36517 2.15601 4.36518L1.784 4.7391C1.77958 4.74355 1.77506 4.74789 1.77045 4.75213C1.64362 4.86862 1.61584 5.15279 1.784 5.32182L2.15596 5.6957C2.38914 5.93001 2.52018 6.24783 2.52025 6.57925V7.10781C2.52025 7.21713 2.56345 7.32196 2.64035 7.39926C2.71725 7.47656 2.82154 7.51998 2.93029 7.51998H3.45606C3.78577 7.52005 4.10205 7.65177 4.33515 7.88615L4.70711 8.26003C4.70709 8.26001 4.70703 8.25996 4.70711 8.26003C4.70866 8.26132 4.73051 8.27956 4.78708 8.29787C4.84316 8.31602 4.91475 8.32803 4.99208 8.32905C5.16589 8.33135 5.2654 8.28059 5.28837 8.25848C5.28853 8.25833 5.28869 8.25817 5.28884 8.25802L5.65879 7.88615C5.6588 7.88613 5.65877 7.88616 5.65879 7.88615C5.89189 7.65179 6.2081 7.52005 6.5378 7.51998H7.06365C7.1724 7.51998 7.2767 7.47656 7.35359 7.39926C7.43049 7.32196 7.4737 7.21713 7.4737 7.10781V6.57934C7.47377 6.24794 7.60478 5.93005 7.83794 5.69574C7.83795 5.69573 7.83792 5.69576 7.83794 5.69574L8.20994 5.32182C8.37792 5.15297 8.36923 4.89296 8.21598 4.74506L8.20994 4.7391L7.83798 4.36523C7.83797 4.36521 7.83799 4.36524 7.83798 4.36523C7.60483 4.13092 7.47377 3.81307 7.4737 3.48168V2.95311C7.4737 2.73618 7.41039 2.65696 7.37227 2.62392C7.32296 2.58118 7.22752 2.54094 7.06365 2.54094H6.53788C6.20817 2.54087 5.8919 2.40916 5.65879 2.17477L5.28683 1.8009ZM4.11462 1.21198C4.53979 0.766993 5.32206 0.65183 5.87602 1.20866L6.24803 1.58258C6.32488 1.65986 6.42917 1.70334 6.53788 1.70339C6.53791 1.70339 6.53785 1.70339 6.53788 1.70339H7.06365C7.34609 1.70339 7.66399 1.77082 7.91643 1.98964C8.18007 2.21817 8.30694 2.55442 8.30694 2.95311V3.4815C8.30694 3.48153 8.30694 3.48147 8.30694 3.4815C8.30699 3.59077 8.3502 3.69564 8.42708 3.7729L8.79644 4.14417C9.29479 4.62874 9.28445 5.42623 8.79913 5.91406L8.42713 6.28798C8.35025 6.36524 8.30699 6.47006 8.30694 6.57934C8.30694 6.57937 8.30694 6.57931 8.30694 6.57934V7.10781C8.30694 7.43926 8.17595 7.75713 7.94279 7.9915C7.70963 8.22586 7.39339 8.35753 7.06365 8.35753H6.53797C6.53794 8.35753 6.538 8.35753 6.53797 8.35753C6.42926 8.35758 6.32493 8.40102 6.24807 8.4783L5.87402 8.85428C5.62619 9.10002 5.26252 9.17025 4.98113 9.16653C4.70256 9.16285 4.34897 9.08451 4.11792 8.85226L3.74592 8.47834C3.66906 8.40106 3.56477 8.35758 3.45606 8.35753C3.45603 8.35753 3.45609 8.35753 3.45606 8.35753H2.93029C2.60055 8.35753 2.28432 8.22586 2.05115 7.9915C1.81799 7.75713 1.687 7.43926 1.687 7.10781V6.57943C1.687 6.5794 1.687 6.57946 1.687 6.57943C1.68695 6.47015 1.64374 6.36528 1.56686 6.28802L1.19481 5.91406C0.703392 5.4201 0.720478 4.59064 1.20065 4.141L1.56681 3.77294C1.6437 3.69569 1.68695 3.59086 1.687 3.48159C1.687 3.48156 1.687 3.48162 1.687 3.48159V2.95311C1.687 2.62166 1.81799 2.30379 2.05115 2.06943C2.28432 1.83506 2.60055 1.70339 2.93029 1.70339H3.45597C3.456 1.70339 3.45594 1.70339 3.45597 1.70339C3.56468 1.70334 3.66901 1.65991 3.74587 1.58263L4.11462 1.21198ZM3.50857 3.51092C3.50857 3.27964 3.6951 3.09215 3.92519 3.09215H3.92951C4.1596 3.09215 4.34613 3.27964 4.34613 3.51092C4.34613 3.7422 4.1596 3.9297 3.92951 3.9297H3.92519C3.6951 3.9297 3.50857 3.7422 3.50857 3.51092ZM6.37847 3.43179C6.54118 3.59533 6.54118 3.86048 6.37847 4.02402L3.78805 6.62783C3.62535 6.79137 3.36156 6.79137 3.19886 6.62783C3.03616 6.46429 3.03616 6.19913 3.19886 6.03559L5.78928 3.43179C5.95198 3.26824 6.21577 3.26824 6.37847 3.43179ZM4.79946 6.5487C4.79946 6.31741 4.98599 6.12992 5.21609 6.12992H5.2204C5.4505 6.12992 5.63702 6.31741 5.63702 6.5487C5.63702 6.77998 5.4505 6.96747 5.2204 6.96747H5.21609C4.98599 6.96747 4.79946 6.77998 4.79946 6.5487Z" fill="currentColor"/>
      </g>
      <defs>
      <clipPath id="clip0_0_742">
      <rect width="10" height="10" fill="white"/>
      </clipPath>
      </defs>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="dfc-banner__link-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <g>
      <path fillRule="evenodd" clipRule="evenodd" d="M9.5286 4.86193C9.78894 4.60158 10.2111 4.60158 10.4714 4.86193L13.1381 7.52859C13.2631 7.65362 13.3333 7.82319 13.3333 8C13.3333 8.17681 13.2631 8.34638 13.1381 8.4714L10.4714 11.1381C10.2111 11.3984 9.78895 11.3984 9.5286 11.1381C9.26825 10.8777 9.26825 10.4556 9.5286 10.1953L11.0572 8.66667H3.33333C2.96514 8.66667 2.66667 8.36819 2.66667 8C2.66667 7.63181 2.96514 7.33333 3.33333 7.33333H11.0572L9.5286 5.80474C9.26825 5.54439 9.26825 5.12228 9.5286 4.86193Z" fill="currentColor"/>
      </g>
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg className="dfc-banner__field-glyph" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <g>
      <path fillRule="evenodd" clipRule="evenodd" d="M1.33333 4C1.33333 3.26362 1.93029 2.66667 2.66667 2.66667H13.3333C14.0697 2.66667 14.6667 3.26362 14.6667 4V12C14.6667 12.7364 14.0697 13.3333 13.3333 13.3333H2.66667C1.93029 13.3333 1.33333 12.7364 1.33333 12V4ZM3.86671 4L8 7.16075L12.1333 4H3.86671ZM13.3333 4.76082L8.80993 8.21989C8.33186 8.58548 7.66814 8.58548 7.19007 8.21989L2.66667 4.76082V12H13.3333V4.76082Z" fill="currentColor"/>
      </g>
    </svg>
  );
}

function QuestionCircleIcon() {
  return (
    <svg className="dfc-banner__hint-glyph" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      <g>
      <path fillRule="evenodd" clipRule="evenodd" d="M7 2.33333C4.42267 2.33333 2.33333 4.42267 2.33333 7C2.33333 9.57733 4.42267 11.6667 7 11.6667C9.57733 11.6667 11.6667 9.57733 11.6667 7C11.6667 4.42267 9.57733 2.33333 7 2.33333ZM1.16667 7C1.16667 3.77834 3.77834 1.16667 7 1.16667C10.2217 1.16667 12.8333 3.77834 12.8333 7C12.8333 10.2217 10.2217 12.8333 7 12.8333C3.77834 12.8333 1.16667 10.2217 1.16667 7ZM7.05036 5.00662C6.81818 4.99775 6.59199 5.08147 6.42154 5.23938C6.2511 5.39728 6.15036 5.61642 6.14149 5.8486C6.12919 6.17053 5.85825 6.42154 5.53632 6.40924C5.21439 6.39694 4.96338 6.126 4.97568 5.80407C4.99636 5.2627 5.23125 4.75171 5.62868 4.38353C6.02611 4.01535 6.55352 3.82012 7.09489 3.8408C7.63626 3.86148 8.14725 4.09637 8.51543 4.4938C8.88203 4.88952 9.07715 5.4141 9.05841 5.95302C9.05375 6.21789 8.99668 6.47924 8.89045 6.72198C8.78328 6.96687 8.62825 7.18787 8.43447 7.372C8.24068 7.55614 8.01205 7.69968 7.76201 7.7942C7.70328 7.8164 7.64366 7.83579 7.58333 7.85234V8.16667C7.58333 8.48883 7.32217 8.75 7 8.75C6.67783 8.75 6.41667 8.48883 6.41667 8.16667V7.3395C6.41667 7.18105 6.48113 7.02941 6.59522 6.91946C6.70932 6.80951 6.86324 6.7507 7.02158 6.75657C7.13336 6.7607 7.24484 6.74246 7.34946 6.70291C7.45409 6.66336 7.54976 6.60329 7.63085 6.52625C7.71193 6.4492 7.7768 6.35672 7.82165 6.25425C7.86649 6.15178 7.8904 6.04138 7.89198 5.92954L7.89234 5.91548C7.90121 5.68331 7.81749 5.45711 7.65958 5.28667C7.50168 5.11622 7.28254 5.01549 7.05036 5.00662ZM6.41083 9.92122C6.41083 9.59906 6.67199 9.33789 6.99416 9.33789H6.99999C7.32216 9.33789 7.58333 9.59906 7.58333 9.92122C7.58333 10.2434 7.32216 10.5046 6.99999 10.5046H6.99416C6.67199 10.5046 6.41083 10.2434 6.41083 9.92122Z" fill="currentColor"/>
      </g>
    </svg>
  );
}

/**
 * Dismiss ("x") glyph — intentional reuse of the same structural close icon
 * already inlined in Badge.tsx and Alert.tsx (icons/close.svg), not a new asset.
 */
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
 *
 * The `type` prop selects one of the Figma component set's eleven layouts.
 * Figma's `Breakpoint` axis (Desktop/Tablet/Mobile) is not a prop: it
 * documents responsive behavior, so it is implemented as media queries in
 * index.css and the single component adapts on its own.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    type = 'default',
    position = 'static',
    showIcon = true,
    icon,
    heading,
    actions,
    linkLabel,
    linkHref,
    fieldLabel = 'Email',
    fieldRequired = false,
    fieldPlaceholder = 'Enter your email',
    fieldHint,
    onSubmit,
    onDismiss,
    dismissLabel = 'Dismiss',
    className,
    children,
    role = 'region',
    ...rest
  },
  ref,
) {
  const fieldId = useId();
  const classified = isClassification(type);

  return (
    <div
      ref={ref}
      role={role}
      className={cx(
        'dfc-banner',
        `dfc-banner--${type}`,
        classified && 'dfc-banner--classified',
        position !== 'static' && `dfc-banner--${position}`,
        className,
      )}
      {...rest}
    >
      {classified && (
        <div className="dfc-banner__marking">
          {showIcon && (
            <span className="dfc-banner__chip" aria-hidden="true">
              {icon ?? <BullhornIcon />}
            </span>
          )}
          <p className="dfc-banner__marking-label">{children ?? CLASSIFICATION_LABELS[type]}</p>
        </div>
      )}

      {type === 'default' && (
        <div className="dfc-banner__lead">
          {showIcon && (
            <span className="dfc-banner__chip" aria-hidden="true">
              {icon ?? <BullhornIcon />}
            </span>
          )}
          <p className="dfc-banner__text">{children}</p>
        </div>
      )}

      {type === 'icon-link' && (
        <div className="dfc-banner__text-link">
          <div className="dfc-banner__text-link-lead">
            <span className="dfc-banner__chip dfc-banner__chip--square" aria-hidden="true">
              {icon ?? <SalePercentIcon />}
            </span>
            <p className="dfc-banner__text">{children}</p>
          </div>
          {linkLabel != null && (
            <a className="dfc-banner__link" href={linkHref}>
              {linkLabel}
              <ArrowRightIcon />
            </a>
          )}
        </div>
      )}

      {type === 'heading-description' && (
        <div className="dfc-banner__copy">
          <div className="dfc-banner__copy-text">
            {heading != null && <p className="dfc-banner__heading">{heading}</p>}
            {children != null && <p className="dfc-banner__description">{children}</p>}
          </div>
          {actions && <div className="dfc-banner__actions">{actions}</div>}
        </div>
      )}

      {type === 'newsletter' && (
        <form className="dfc-banner__form" onSubmit={onSubmit}>
          <div className="dfc-banner__field">
            <label className="dfc-banner__field-label" htmlFor={fieldId}>
              {fieldLabel}
              {fieldRequired && (
                <span className="dfc-banner__field-required" aria-hidden="true">
                  *
                </span>
              )}
              {fieldHint && (
                <span className="dfc-banner__hint" title={fieldHint}>
                  <QuestionCircleIcon />
                </span>
              )}
            </label>
            <div className="dfc-banner__field-control">
              <EnvelopeIcon />
              <input
                id={fieldId}
                className="dfc-banner__input"
                type="email"
                name="email"
                required={fieldRequired}
                placeholder={fieldPlaceholder}
              />
            </div>
          </div>
          {actions && <div className="dfc-banner__actions">{actions}</div>}
        </form>
      )}

      {type === 'logo-button' && (
        <>
          <div className="dfc-banner__brand">
            <Wordmark className="dfc-banner__wordmark" />
            <Logo className="dfc-banner__mark" size={24} />
            <div className="dfc-banner__brand-text">{children}</div>
          </div>
          {actions && <div className="dfc-banner__actions">{actions}</div>}
        </>
      )}

      {(type === 'default' || type === 'icon-link' || classified) && actions && (
        <div className="dfc-banner__actions">{actions}</div>
      )}

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
