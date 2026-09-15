import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Avatar } from './Avatar';
import { Checkbox } from './Checkbox';
import { DropdownHeader } from './DropdownHeader';
import { DropdownListItem } from './DropdownListItem';
import * as G from './MenuIcons';

/**
 * Maps 1:1 to the Figma "Dropdown menu" component set's `Type` axis
 * (node 1149:39895), kebab-cased. There is no `State` axis.
 *
 * NOTE ON SHAPE: every one of these types is the same surface wrapping a
 * different arrangement of `DropdownHeader` / `DropdownListItem` / `Checkbox`,
 * so the sample content the design draws (the folder names, the model list,
 * the people) is baked in here rather than being passed by the caller. That is
 * deliberate and was chosen explicitly — it reproduces the Figma frame exactly,
 * at the cost of these being demonstrations rather than reusable menus. To
 * build a real menu, compose `DropdownMenu` (or a plain element carrying
 * `.dfc-ddm`) with your own items instead of using a `type`.
 */
export type DropdownMenuType =
  | 'default'
  | 'user-profile'
  | 'language-select'
  | 'with-radio-input'
  | 'with-toggle'
  | 'menu'
  | 'users'
  | 'checkbox'
  | 'with-separator'
  | 'with-scroll'
  | 'heading-button'
  | 'user-selection'
  | 'with-number-inputs'
  | 'with-forms'
  | 'text-illustration'
  | 'grid';

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  type?: DropdownMenuType;
  /**
   * Replaces the baked-in sample content. When supplied, `type` still selects
   * the surface's layout (width, list vs grid, scroll) but the body is yours.
   */
  children?: ReactNode;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** The 1px rule the design uses between groups of rows. */
export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div className={cx('dfc-ddm__separator', className)} role="separator">
      <span />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Small pieces the compositions need that are not components of their own
 * ------------------------------------------------------------------ */

function MenuButton({
  tone = 'neutral',
  icon,
  children,
  block,
}: {
  tone?: 'neutral' | 'brand' | 'danger';
  icon?: ReactNode;
  children: ReactNode;
  block?: boolean;
}) {
  return (
    <button
      type="button"
      className={cx('dfc-ddm__btn', `dfc-ddm__btn--${tone}`, block && 'dfc-ddm__btn--block')}
    >
      {icon}
      {children}
    </button>
  );
}

function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <span className="dfc-ddm__field">
      <G.Search className="dfc-ddm__field-icon" />
      <input type="search" className="dfc-ddm__input" placeholder={placeholder} aria-label={placeholder} />
    </span>
  );
}

function Stepper({ value }: { value: number }) {
  return (
    <span className="dfc-ddm__stepper">
      <button type="button" className="dfc-ddm__stepper-btn" aria-label="Decrease">
        &minus;
      </button>
      <span className="dfc-ddm__stepper-value">{value}</span>
      <button type="button" className="dfc-ddm__stepper-btn" aria-label="Increase">
        +
      </button>
    </span>
  );
}

function ModelRow({
  logo,
  name,
  active,
}: {
  logo: ReactNode;
  name: string;
  active?: boolean;
}) {
  return (
    <div className={cx('dfc-ddm__model', active && 'is-active')}>
      <span className="dfc-ddm__model-name">
        {logo}
        {name}
      </span>
      <span className="dfc-ddm__model-badges">
        <span className="dfc-ddm__model-badge">
          <G.Eye />
        </span>
        <span className="dfc-ddm__model-badge">
          <G.FilePdf />
        </span>
        <span className="dfc-ddm__model-badge">
          <G.Globe />
        </span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The sixteen compositions
 * ------------------------------------------------------------------ */

const PEOPLE_CHECK = [
  ['Bonnie Green', 'BG', false],
  ['Jese Leos', 'JL', false],
  ['Roberta Casas', 'RC', false],
  ['Karen Nelson', 'KN', false],
  ['Joseph McFall', 'JM', true],
  ['Helene Engels', 'HE', false],
  ['Thomas Lean', 'TL', true],
  ['Robert Brown', 'RB', false],
  ['Lana Byrd', 'LB', false],
  ['Leslie Livingston', 'LL', false],
] as const;

function renderBody(type: DropdownMenuType): ReactNode {
  switch (type) {
    case 'user-profile':
      return (
        <>
          <DropdownHeader
            type="with-avatar"
            avatar={<Avatar size="base" initials="JL" />}
            text="Jese Leos"
            secondaryText="name@DEFCON.com"
            badge="Basic"
          />
          <DropdownListItem leftIcon={<G.User />} text="Account" />
          <DropdownListItem leftIcon={<G.AdjustmentsHorizontal />} text="Settings" />
          <DropdownListItem leftIcon={<G.Lock />} text="Privacy" />
          <DropdownListItem leftIcon={<G.Bell />} text="Notifications" />
          <DropdownListItem leftIcon={<G.QuestionCircle />} text="Help center" />
          <DropdownListItem type="right-form" leftIcon={<G.Moon />} text="Dark mode" />
          <DropdownMenuSeparator />
          <DropdownListItem leftIcon={<G.Rocket />} text="Upgrade to PRO" />
          <DropdownListItem tone="danger" leftIcon={<G.SignOut />} text="Sign out" />
        </>
      );

    case 'language-select':
      return (
        <>
          <DropdownListItem type="flag" flag={<G.FlagEn />} text="English" />
          <DropdownListItem type="flag" flag={<G.FlagFr />} text="French" />
          <DropdownListItem type="flag" flag={<G.FlagEs />} text="Espaniol" />
          <DropdownListItem type="flag" flag={<G.FlagDe />} text="Deutch" />
          <DropdownListItem type="flag" flag={<G.FlagIt />} text="Italiano" />
          <DropdownListItem type="flag" flag={<G.FlagZh />} text="中文 (繁體)" />
        </>
      );

    case 'with-radio-input':
      return (
        <>
          <DropdownListItem type="left-form" control="radio" text="Individual" secondaryText="(456)" />
          <DropdownListItem type="left-form" control="radio" text="Company" secondaryText="(53)" />
          <DropdownListItem type="left-form" text="Enterprise" secondaryText="(34)" />
          <DropdownListItem type="left-form" control="radio" text="Non-profit" secondaryText="(70)" />
          <DropdownListItem type="left-form" control="radio" text="Goverment" secondaryText="(103)" />
        </>
      );

    case 'with-toggle':
      return (
        <>
          {[
            ['Enable notifications', 'Never miss out on important events, launches and webinars.', false],
            ['Enable 2FA authentication', 'Add an extra layer of security to your account and stay safe.', false],
            ['Remember me on this device', 'Stay logged in without needing to enter your password again.', true],
            [
              'Require password for every login',
              'Always require your password for each login to ensure maximum security',
              false,
            ],
            ['Subscribe to our newsletter', 'Stay informed about our latest news and promotions.', false],
          ].map(([label, helper, on]) => (
            <div className="dfc-ddm__toggle-row" key={label as string}>
              <Checkbox
                variant="toggle"
                defaultChecked={on as boolean}
                label={label as string}
                helperText={helper as string}
              />
            </div>
          ))}
        </>
      );

    case 'menu':
      return (
        <>
          <div className="dfc-ddm__cta">
            <div className="dfc-ddm__cta-text">
              <p className="dfc-ddm__cta-title">Unlock all models now</p>
              <MenuButton icon={<G.Rocket className="dfc-ddm__btn-icon" />}>Upgrade now</MenuButton>
            </div>
            <div className="dfc-ddm__price">
              <span className="dfc-ddm__price-amount">$19</span>
              <span className="dfc-ddm__price-period">monthly</span>
            </div>
          </div>
          <div className="dfc-ddm__models">
            <ModelRow logo={<G.ModelGemini />} name="Gemini 2.0 Flash" />
            <ModelRow logo={<G.ModelGpt />} name="Gpt-4o-mini" active />
            <ModelRow logo={<G.ModelClaude />} name="Claude 3 Haiku" />
            <ModelRow logo={<G.ModelDeepseek />} name="DeepSeek v3 (Fireworks)" />
            <ModelRow logo={<G.ModelClaude />} name="Claude 3.5 Sonnet" />
            <ModelRow logo={<G.ModelMistral />} name="Mistral ai" />
            <ModelRow logo={<G.ModelDeepseek />} name="DeepSeek v3 (Fireworks)" />
          </div>
          <MenuButton icon={<G.Eye className="dfc-ddm__btn-icon" />} block>
            Show all
          </MenuButton>
        </>
      );

    case 'users':
      return (
        <>
          <DropdownHeader type="form" placeholder="Search for user" />
          {PEOPLE_CHECK.map(([name, initials, checked]) => (
            <DropdownListItem
              key={name}
              type="avatar-form"
              avatar={<Avatar size="xs" initials={initials} />}
              text={name}
              defaultChecked={checked}
            />
          ))}
          <MenuButton tone="danger" block>
            Delete user
          </MenuButton>
        </>
      );

    case 'checkbox':
      return (
        <>
          {[0, 1, 2].map((i) => (
            <DropdownListItem
              key={i}
              type="only-form"
              text="Remember me"
              secondaryText="Save my credentials for easier sign-in"
            />
          ))}
        </>
      );

    case 'with-separator':
      return (
        <>
          <DropdownListItem type="badge" leftIcon={<G.LetterBold />} text="Bold" badge={<Kbd letter="B" />} />
          <DropdownListItem type="badge" leftIcon={<G.LetterItalic />} text="Italic" badge={<Kbd letter="I" />} />
          <DropdownListItem
            type="badge"
            leftIcon={<G.LetterUnderline />}
            text="Underline"
            badge={<Kbd letter="U" />}
          />
          <DropdownListItem
            type="badge"
            leftIcon={<G.TextSlash />}
            text="Strikethrough"
            badge={<Kbd letter="X" />}
          />
          <DropdownListItem type="badge" leftIcon={<G.Link />} text="Create link" badge={<Kbd letter="K" />} />
          <DropdownMenuSeparator />
          <DropdownListItem
            type="badge"
            leftIcon={<G.OrderedList />}
            text="Ordered list"
            badge={<Kbd letter="8" />}
          />
          <DropdownListItem type="badge" leftIcon={<G.List />} text="Unordered list" badge={<Kbd letter="7" />} />
          <DropdownMenuSeparator />
          <DropdownListItem type="two-icons" leftIcon={<G.FontFamily />} text="Font family" rightIcon={<G.AngleRight />} />
          <DropdownListItem type="two-icons" leftIcon={<G.TextSize />} text="Font size" rightIcon={<G.AngleRight />} />
          <DropdownListItem type="two-icons" leftIcon={<G.FontColor />} text="Font color" rightIcon={<G.AngleRight />} />
        </>
      );

    case 'with-scroll':
      return (
        <>
          <div className="dfc-ddm__static dfc-ddm__static--top">
            <SearchField placeholder="Search for user" />
          </div>
          <div className="dfc-ddm__scroll">
            {[
              ['Leslie Livingston', 'LL', false],
              ['Robert Brown', 'RB', true],
              ['Lana Byrd', 'LB', false],
              ['Karen Nelson', 'KN', true],
              ['Joseph McFall', 'JM', false],
              ['Roberta Casas', 'RC', true],
              ['Jese Leos', 'JL', false],
              ['Thomas Lean', 'TL', false],
            ].map(([name, initials, checked]) => (
              <DropdownListItem
                key={name as string}
                type="avatar-form"
                avatar={<Avatar size="xs" initials={initials as string} />}
                text={name as string}
                defaultChecked={checked as boolean}
              />
            ))}
            <DropdownMenuSeparator />
            <DropdownListItem leftIcon={<G.UserAdd />} text="First Action" />
            <DropdownListItem leftIcon={<G.UserAdd />} text="First Action" />
          </div>
          <div className="dfc-ddm__static dfc-ddm__static--bottom">
            <MenuButton tone="brand" icon={<G.UserAdd className="dfc-ddm__btn-icon" />} block>
              Add users
            </MenuButton>
          </div>
        </>
      );

    case 'heading-button':
      return (
        <>
          <p className="dfc-ddm__heading">Save to colection</p>
          <DropdownListItem leftIcon={<G.Folder />} text="Modern UI elements" />
          <DropdownListItem leftIcon={<G.Folder />} text="Top navbars collection" />
          <DropdownListItem leftIcon={<G.Folder />} text="Premium Button Styles" />
          <DropdownListItem leftIcon={<G.Folder />} text="E-commerce design gems" />
          <DropdownListItem leftIcon={<G.Folder />} text="UI animations" />
          <MenuButton block>+ Create new collection</MenuButton>
        </>
      );

    case 'user-selection':
      return (
        <>
          <DropdownListItem
            type="user-select"
            avatar={<Avatar size="sm" initials="JM" />}
            text="Joseph McFall"
            secondaryText="Last active 3 hrs ago"
          />
          <DropdownListItem
            type="user-select"
            avatar={<Avatar size="sm" initials="LL" />}
            text="Leslie Livingston"
            secondaryText="Last active last week"
          />
          <DropdownListItem
            type="user-select"
            avatar={<Avatar size="sm" initials="MG" />}
            text="Micheal Gough"
            secondaryText="Last active 1 min ago"
            badge={<span className="dfc-ddm__pill">Default</span>}
          />
          <DropdownListItem
            type="user-select"
            avatar={<Avatar size="sm" initials="RC" />}
            text="Roberta Casas"
            secondaryText="Last active 1 month ago"
          />
        </>
      );

    case 'with-number-inputs':
      return (
        <>
          {[
            ['Adults', 'Age 13+', 2],
            ['Children', '$Ages 2-12', 4],
            ['Infants', 'Under 2', 2],
            ['Pets', null, 1],
          ].map(([label, helper, value]) => (
            <div className="dfc-ddm__number-row" key={label as string}>
              <span className="dfc-ddm__number-text">
                <span className="dfc-ddm__number-label">{label as string}</span>
                {helper != null && <span className="dfc-ddm__number-helper">{helper as string}</span>}
              </span>
              <Stepper value={value as number} />
            </div>
          ))}
        </>
      );

    case 'with-forms':
      return (
        <div className="dfc-ddm__form-row">
          <span className="dfc-ddm__field">
            <G.CalendarMonth className="dfc-ddm__field-icon" width={16} height={16} />
            <input className="dfc-ddm__input" placeholder="Start date" aria-label="Start date" />
          </span>
          <span className="dfc-ddm__form-sep">to</span>
          <span className="dfc-ddm__field">
            <G.CalendarMonth className="dfc-ddm__field-icon" width={16} height={16} />
            <input className="dfc-ddm__input" placeholder="End date" aria-label="End date" />
          </span>
        </div>
      );

    case 'text-illustration':
      return (
        <div className="dfc-ddm__empty">
          <G.IllustrationNoNotifications />
          <p className="dfc-ddm__empty-title">No notifications yet</p>
          <p className="dfc-ddm__empty-body">
            You&rsquo;re all caught up! Check back later for updates or new alerts.
          </p>
        </div>
      );

    case 'grid':
      return (
        <>
          <DropdownListItem type="boxed" leftIcon={<G.UserCircle />} text="Account" />
          <DropdownListItem type="boxed" leftIcon={<G.AdjustmentsVertical />} text="Settings" />
          <DropdownListItem type="boxed" leftIcon={<G.InboxFull />} text="Inbox" />
          <DropdownListItem type="boxed" leftIcon={<G.CalendarMonth />} text="Calendar" />
          <DropdownListItem type="boxed" leftIcon={<G.Messages />} text="Chat" />
          <DropdownListItem type="boxed" leftIcon={<G.Cart />} text="Sales" />
          <DropdownListItem type="boxed" leftIcon={<G.Archive />} text="Products" />
          <DropdownListItem type="boxed" leftIcon={<G.FileInvoice />} text="Invoices" />
          <DropdownListItem type="boxed" leftIcon={<G.UserHeadset />} text="Support" />
        </>
      );

    default:
      return (
        <>
          <DropdownListItem leftIcon={<G.User />} text="Account" />
          <DropdownListItem leftIcon={<G.AdjustmentsHorizontal />} text="Settings" />
          <DropdownListItem leftIcon={<G.Lock />} text="Privacy" />
          <DropdownListItem leftIcon={<G.Bell />} text="Notifications" />
          <DropdownListItem leftIcon={<G.QuestionCircle />} text="Help center" />
          <DropdownListItem tone="danger" leftIcon={<G.SignOut />} text="Sign out" />
        </>
      );
  }
}

/** The ⌘-key badge used by the `with-separator` composition. */
function Kbd({ letter }: { letter: string }) {
  return (
    <span className="dfc-ddm__kbd">
      <G.Command />
      {letter}
    </span>
  );
}

/**
 * The surface that holds a dropdown's header and rows — the sixteen
 * compositions of the Figma "Dropdown menu" component set.
 *
 * Painted from the `--color-*` token families in tokens.css, so it follows
 * light/dark automatically. See the note on `DropdownMenuType` about the
 * baked-in sample content.
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu(
  { type = 'default', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="menu"
      className={cx('dfc-ddm', `dfc-ddm--${type}`, className)}
      {...rest}
    >
      {children ?? renderBody(type)}
    </div>
  );
});
