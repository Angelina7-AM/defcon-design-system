import { render, screen, within } from '@testing-library/react';
import { DropdownMenu, DropdownMenuSeparator } from './DropdownMenu';
import type { DropdownMenuType } from './DropdownMenu';

const ALL_TYPES: DropdownMenuType[] = [
  'default',
  'user-profile',
  'language-select',
  'with-radio-input',
  'with-toggle',
  'menu',
  'users',
  'checkbox',
  'with-separator',
  'with-scroll',
  'heading-button',
  'user-selection',
  'with-number-inputs',
  'with-forms',
  'text-illustration',
  'grid',
];

describe('DropdownMenu', () => {
  it('covers all 16 Figma types with a modifier class', () => {
    expect(ALL_TYPES).toHaveLength(16);
    for (const type of ALL_TYPES) {
      const { container, unmount } = render(<DropdownMenu type={type} />);
      const root = container.querySelector('.dfc-ddm');
      expect(root, type).toBeInTheDocument();
      expect(root, type).toHaveClass(`dfc-ddm--${type}`);
      unmount();
    }
  });

  it('renders every type without throwing and with some content', () => {
    for (const type of ALL_TYPES) {
      const { container, unmount } = render(<DropdownMenu type={type} />);
      expect(container.querySelector('.dfc-ddm')!.childElementCount, type).toBeGreaterThan(0);
      unmount();
    }
  });

  it('defaults to the account menu, with a destructive sign-out row', () => {
    const { container } = render(<DropdownMenu />);
    expect(container.querySelector('.dfc-ddm')).toHaveClass('dfc-ddm--default');
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(container.querySelector('.dfc-ddli--danger')).toHaveTextContent('Sign out');
  });

  it('renders the language list with one row per locale', () => {
    const { container } = render(<DropdownMenu type="language-select" />);
    expect(container.querySelectorAll('.dfc-ddli--flag')).toHaveLength(6);
    expect(screen.getByText('中文 (繁體)')).toBeInTheDocument();
  });

  it('uses radio controls for with-radio-input', () => {
    const { container } = render(<DropdownMenu type="with-radio-input" />);
    expect(container.querySelectorAll('.dfc-checkbox--radio').length).toBeGreaterThan(0);
    expect(screen.getByText('Individual')).toBeInTheDocument();
  });

  it('renders separators in with-separator', () => {
    const { container } = render(<DropdownMenu type="with-separator" />);
    expect(container.querySelectorAll('.dfc-ddm__separator')).toHaveLength(2);
    expect(screen.getByText('Strikethrough')).toBeInTheDocument();
  });

  it('gives with-scroll a scroll region between two static bars', () => {
    const { container } = render(<DropdownMenu type="with-scroll" />);
    expect(container.querySelector('.dfc-ddm__scroll')).toBeInTheDocument();
    expect(container.querySelector('.dfc-ddm__static--top')).toBeInTheDocument();
    expect(container.querySelector('.dfc-ddm__static--bottom')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add users/ })).toBeInTheDocument();
  });

  it('checks the people the design marks selected in users', () => {
    const { container } = render(<DropdownMenu type="users" />);
    const checked = container.querySelectorAll('input:checked');
    expect(checked).toHaveLength(2); // Joseph McFall + Thomas Lean
    expect(screen.getByRole('button', { name: /Delete user/ })).toBeInTheDocument();
  });

  it('renders the model list and CTA for menu', () => {
    const { container } = render(<DropdownMenu type="menu" />);
    expect(screen.getByText('Unlock all models now')).toBeInTheDocument();
    expect(screen.getByText('$19')).toBeInTheDocument();
    expect(container.querySelectorAll('.dfc-ddm__model')).toHaveLength(7);
    // three capability badges per model row
    const firstRow = container.querySelector('.dfc-ddm__model')!;
    expect(within(firstRow as HTMLElement).getByText('Gemini 2.0 Flash')).toBeInTheDocument();
    expect(firstRow.querySelectorAll('.dfc-ddm__model-badge')).toHaveLength(3);
  });

  it('renders steppers for with-number-inputs', () => {
    const { container } = render(<DropdownMenu type="with-number-inputs" />);
    expect(container.querySelectorAll('.dfc-ddm__stepper')).toHaveLength(4);
    expect(screen.getAllByRole('button', { name: 'Increase' })).toHaveLength(4);
    expect(screen.getByText('Adults')).toBeInTheDocument();
  });

  it('renders two labelled date fields for with-forms', () => {
    render(<DropdownMenu type="with-forms" />);
    expect(screen.getByLabelText('Start date')).toBeInTheDocument();
    expect(screen.getByLabelText('End date')).toBeInTheDocument();
    expect(screen.getByText('to')).toBeInTheDocument();
  });

  it('renders the empty state for text-illustration', () => {
    render(<DropdownMenu type="text-illustration" />);
    expect(screen.getByText('No notifications yet')).toBeInTheDocument();
    expect(screen.getByText(/all caught up/)).toBeInTheDocument();
  });

  it('lays grid out as nine boxed tiles', () => {
    const { container } = render(<DropdownMenu type="grid" />);
    expect(container.querySelectorAll('.dfc-ddli--boxed')).toHaveLength(9);
  });

  it('lets children replace the baked-in sample content', () => {
    const { container } = render(
      <DropdownMenu type="default">
        <span data-testid="mine">Custom</span>
      </DropdownMenu>,
    );
    expect(screen.getByTestId('mine')).toBeInTheDocument();
    expect(container.querySelector('.dfc-ddli')).not.toBeInTheDocument();
  });

  it('exposes the separator as a standalone component', () => {
    const { container } = render(<DropdownMenuSeparator />);
    expect(container.querySelector('.dfc-ddm__separator')).toHaveAttribute('role', 'separator');
  });

  it('is exposed as a menu to assistive tech', () => {
    render(<DropdownMenu />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
