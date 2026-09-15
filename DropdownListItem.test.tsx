import { fireEvent, render, screen } from '@testing-library/react';
import { DropdownListItem } from './DropdownListItem';
import type { DropdownListItemType } from './DropdownListItem';

const ALL_TYPES: DropdownListItemType[] = [
  'default',
  'secondary-text',
  'two-icons',
  'multiple-icons',
  'left-form',
  'right-form',
  'form-dot',
  'form-icons',
  'avatar-form',
  'only-form',
  'badge',
  'user-select',
  'boxed',
  'icon-shapes',
  'flag',
  'checkbox-icon',
  'flag-checkbox',
];

const FORM_TYPES: DropdownListItemType[] = [
  'left-form',
  'right-form',
  'form-dot',
  'form-icons',
  'avatar-form',
  'only-form',
  'checkbox-icon',
  'flag-checkbox',
];

describe('DropdownListItem', () => {
  it('covers all 17 Figma types with a modifier class', () => {
    expect(ALL_TYPES).toHaveLength(17);
    for (const type of ALL_TYPES) {
      const { container, unmount } = render(<DropdownListItem type={type} text="First Action" />);
      const root = container.querySelector('.dfc-ddli');
      expect(root, type).toBeInTheDocument();
      expect(root, type).toHaveClass(`dfc-ddli--${type}`);
      unmount();
    }
  });

  it('renders text and defaults to the default type', () => {
    const { container } = render(<DropdownListItem text="First Action" />);
    expect(screen.getByText('First Action')).toBeInTheDocument();
    expect(container.querySelector('.dfc-ddli')).toHaveClass('dfc-ddli--default');
  });

  it('renders secondary text for the secondary-text type', () => {
    render(<DropdownListItem type="secondary-text" text="First Action" secondaryText="(456)" />);
    expect(screen.getByText('(456)')).toBeInTheDocument();
  });

  it('renders a form control for every form type, and none for the others', () => {
    for (const type of ALL_TYPES) {
      const { container, unmount } = render(<DropdownListItem type={type} text="First Action" />);
      const control = container.querySelector('.dfc-checkbox__input');
      if (FORM_TYPES.includes(type)) {
        expect(control, `${type} should have a control`).toBeInTheDocument();
      } else {
        expect(control, `${type} should not have a control`).not.toBeInTheDocument();
      }
      unmount();
    }
  });

  it('uses a toggle for right-form and a checkbox elsewhere', () => {
    const { container: toggle } = render(<DropdownListItem type="right-form" text="a" />);
    expect(toggle.querySelector('.dfc-checkbox--toggle')).toBeInTheDocument();

    const { container: check } = render(<DropdownListItem type="left-form" text="a" />);
    expect(check.querySelector('.dfc-checkbox--checkbox')).toBeInTheDocument();
  });

  it('honours an explicit control override', () => {
    const { container } = render(
      <DropdownListItem type="left-form" control="radio" text="a" />,
    );
    expect(container.querySelector('.dfc-checkbox--radio')).toBeInTheDocument();
    expect(container.querySelector('input')).toHaveAttribute('type', 'radio');
  });

  it('fires onCheckedChange when the control is toggled', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <DropdownListItem type="left-form" text="a" onCheckedChange={onCheckedChange} />,
    );
    fireEvent.click(container.querySelector('input')!);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders the composed slots', () => {
    render(
      <DropdownListItem
        type="user-select"
        avatar={<img data-testid="avatar" alt="" />}
        text="Jese Leos"
        secondaryText="name@DEFCON.com"
        badge={<span data-testid="badge">Default</span>}
      />,
    );
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByText('Jese Leos')).toBeInTheDocument();
    expect(screen.getByText('name@DEFCON.com')).toBeInTheDocument();
  });

  it('wraps the leading glyph in a chip for icon-shapes only', () => {
    const { container: shaped } = render(
      <DropdownListItem type="icon-shapes" leftIcon={<svg />} text="a" />,
    );
    expect(shaped.querySelector('.dfc-ddli__icon-shape')).toBeInTheDocument();

    const { container: plain } = render(
      <DropdownListItem type="default" leftIcon={<svg />} text="a" />,
    );
    expect(plain.querySelector('.dfc-ddli__icon-shape')).not.toBeInTheDocument();
  });

  it('applies a custom dot color for form-dot', () => {
    const { container } = render(
      <DropdownListItem type="form-dot" text="a" dotColor="rgb(255, 0, 0)" />,
    );
    expect(container.querySelector('.dfc-ddli__dot')).toHaveStyle({ background: 'rgb(255, 0, 0)' });
  });

  it('marks disabled rows and disables their control', () => {
    const { container } = render(<DropdownListItem type="left-form" text="a" disabled />);
    expect(container.querySelector('.dfc-ddli')).toHaveClass('is-disabled');
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('exposes non-form rows as focusable menu items, and removes them from the tab order when disabled', () => {
    render(<DropdownListItem text="First Action" />);
    const item = screen.getByRole('menuitem');
    expect(item).toHaveAttribute('tabindex', '0');

    const { container } = render(<DropdownListItem text="Second" disabled />);
    const disabledItem = container.querySelector('.dfc-ddli')!;
    expect(disabledItem).toHaveAttribute('tabindex', '-1');
    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders only-form as a label-bearing checkbox rather than a nested label', () => {
    const { container } = render(
      <DropdownListItem type="only-form" text="Remember me" secondaryText="Save my credentials" />,
    );
    expect(container.querySelectorAll('label')).toHaveLength(1);
    expect(screen.getByLabelText(/Remember me/)).toBeInTheDocument();
    expect(screen.getByText('Save my credentials')).toBeInTheDocument();
  });
});
