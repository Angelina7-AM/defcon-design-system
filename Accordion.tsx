import { createContext, forwardRef, useContext, useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Reconciles with the Figma "Accordion" component set's `Style` axis
 * (Default, Flush, Separate Cards, With sub-header, Multi-level):
 * - `bordered` = Figma's "Default" — hairline separators between items, no
 *   outer card background.
 * - `flush` = Figma's "Flush" — no side padding/borders at all, items sit
 *   directly on the surrounding surface.
 * - `cards` = Figma's "Separate Cards" — each item is its own bordered card
 *   with a gap between items.
 *
 * "With sub-header" and "Multi-level" are not separate `variant` values —
 * they're composition patterns (a subtitle under the title, and nesting
 * another `Accordion` inside a panel), both already supported by
 * `AccordionItem`'s `subtitle` prop and plain children composition. See the
 * component doc comments below for details.
 */
export type AccordionVariant = 'bordered' | 'flush' | 'cards';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AccordionVariant;
  /**
   * When true, opening an item closes any other open sibling (single-open /
   * "always one at a time" behavior). Defaults to false, meaning multiple
   * items can be open simultaneously — this matches the Figma reference,
   * which shows several sibling items open at once with independent
   * chevrons (e.g. the Multi-level variant has two nested items expanded
   * side by side).
   */
  collapseSiblings?: boolean;
  /**
   * Controlled mode: the id (or ids) of the currently open item(s). Pass a
   * single string when `collapseSiblings` is true, or an array for
   * multi-open. Supply together with `onOpenChange` to fully control state;
   * omit to let the accordion manage its own state internally (uncontrolled,
   * the default — see the design note in the source for why both are
   * supported).
   */
  openItems?: string | string[];
  /** Uncontrolled mode: which item id(s) start open. Ignored if `openItems` is provided. */
  defaultOpenItems?: string | string[];
  /** Fired whenever the open set changes, in both controlled and uncontrolled modes. */
  onOpenChange?: (openItems: string[]) => void;
}

interface AccordionContextValue {
  variant: AccordionVariant;
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside an <Accordion>.`);
  }
  return ctx;
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Chevron indicating open/closed state. This is the same two-segment
 * chevron path used by `Breadcrumb`'s separator icon (see
 * `icons/chevron-right.svg`), just rotated 90° via CSS so it points down —
 * Figma's Accordion uses an identical chevron shape, only turned to face
 * down (closed) / up (open), so no new asset is needed.
 */
function ChevronIcon() {
  return (
    <svg
      className="dfc-accordion-item__chevron-icon"
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

/**
 * Container for a set of `AccordionItem`s.
 *
 * State design: uncontrolled by default (tracks open item ids in internal
 * `useState`, seeded from `defaultOpenItems`) because that's the common case
 * for disclosure widgets — most consumers just want it to work without
 * wiring up state. Controlled mode is supported by passing `openItems`
 * (paired with `onOpenChange`) for the less common cases where a parent
 * needs to drive/observe which panels are open (e.g. syncing with a URL
 * hash, or a "multi-level" nested accordion whose parent wants to close
 * children when the parent panel closes). The two modes are distinguished
 * the standard React way: `openItems !== undefined` means controlled.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    variant = 'bordered',
    collapseSiblings = false,
    openItems,
    defaultOpenItems,
    onOpenChange,
    className,
    children,
    ...rest
  },
  ref,
) {
  const isControlled = openItems !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState<string[]>(() => toArray(defaultOpenItems));
  const openSet = isControlled ? toArray(openItems) : uncontrolledOpen;

  function toggle(id: string) {
    const currentlyOpen = openSet.includes(id);
    let next: string[];
    if (collapseSiblings) {
      next = currentlyOpen ? [] : [id];
    } else {
      next = currentlyOpen ? openSet.filter((openId) => openId !== id) : [...openSet, id];
    }
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }

  return (
    <div
      ref={ref}
      className={cx('dfc-accordion', `dfc-accordion--${variant}`, className)}
      {...rest}
    >
      <AccordionContext.Provider
        value={{ variant, isOpen: (id) => openSet.includes(id), toggle }}
      >
        {children}
      </AccordionContext.Provider>
    </div>
  );
});

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'title'> {
  /**
   * Stable identifier for this item within the accordion — used to track
   * open/closed state. Auto-generated via `useId` if omitted, but pass an
   * explicit id if you need to control this item from `Accordion`'s
   * `openItems`/`defaultOpenItems` props.
   */
  id?: string;
  /** Header text. For richer headers, pass a `title` node alongside `icon`/`subtitle` instead of using `children` for the title. */
  title: ReactNode;
  /**
   * Secondary line under the title, rendered smaller/dimmer. Matches
   * Figma's "With sub-header" style — pass this instead of switching
   * `Accordion`'s `variant`, since it's a per-item concern.
   */
  subtitle?: ReactNode;
  /**
   * Leading icon rendered before the title, matching Figma's `Icon` axis.
   * The consumer supplies the icon node (e.g. an `<svg>`); this component
   * only reserves the layout slot.
   */
  icon?: ReactNode;
  /** Panel content, shown when the item is open. */
  children?: ReactNode;
  /** Uncontrolled initial state for this item, used only if its id isn't present in the parent's `defaultOpenItems`. */
  defaultOpen?: boolean;
  /** Disables the header button, preventing the panel from being toggled. */
  disabled?: boolean;
}

/** A single header+panel pair. Must be rendered inside an `Accordion`. */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  {
    id,
    title,
    subtitle,
    icon,
    children,
    defaultOpen = false,
    disabled = false,
    className,
    ...rest
  },
  ref,
) {
  const { variant, isOpen, toggle } = useAccordionContext('AccordionItem');
  const generatedId = useId();
  const itemId = id ?? generatedId;
  const headerId = `${itemId}-header`;
  const panelId = `${itemId}-panel`;

  // Register this item's `defaultOpen` with the parent on mount, so a
  // consumer doesn't have to know each item's id/default up front via
  // `Accordion`'s own `defaultOpenItems` prop. Runs once per item; a mount
  // effect (not a render-time state update) keeps this a normal commit-phase
  // side effect rather than mutating parent state while rendering.
  const hasRegisteredDefault = useRef(false);
  useEffect(() => {
    if (!hasRegisteredDefault.current) {
      hasRegisteredDefault.current = true;
      if (defaultOpen && !isOpen(itemId)) {
        toggle(itemId);
      }
    }
    // Intentionally run only once on mount — `defaultOpen` is an initial
    // value, like `defaultValue` on an <input>, not a controlled prop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = isOpen(itemId);

  return (
    <div
      ref={ref}
      className={cx(
        'dfc-accordion-item',
        `dfc-accordion-item--${variant}`,
        open && 'dfc-accordion-item--open',
        disabled && 'dfc-accordion-item--disabled',
        className,
      )}
      {...rest}
    >
      <h3 className="dfc-accordion-item__heading">
        <button
          type="button"
          id={headerId}
          className="dfc-accordion-item__button"
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => toggle(itemId)}
        >
          {icon && <span className="dfc-accordion-item__icon">{icon}</span>}
          <span className="dfc-accordion-item__header-text">
            <span className="dfc-accordion-item__title">{title}</span>
            {subtitle && <span className="dfc-accordion-item__subtitle">{subtitle}</span>}
          </span>
          <ChevronIcon />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
        className="dfc-accordion-item__panel"
      >
        <div className="dfc-accordion-item__panel-inner">{children}</div>
      </div>
    </div>
  );
});
