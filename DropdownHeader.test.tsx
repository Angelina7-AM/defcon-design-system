import { fireEvent, render, screen } from '@testing-library/react';
import { DropdownHeader } from './DropdownHeader';
import type { DropdownHeaderType } from './DropdownHeader';

const ALL_TYPES: DropdownHeaderType[] = [
  'text-helper',
  'with-avatar',
  'selector',
  'big-avatar',
  'form',
];

describe('DropdownHeader', () => {
  it('covers all 5 Figma types with a modifier class', () => {
    expect(ALL_TYPES).toHaveLength(5);
    for (const type of ALL_TYPES) {
      const { container, unmount } = render(<DropdownHeader type={type} text="Jese Leos" />);
      const root = container.querySelector('.dfc-ddh');
      expect(root, type).toBeInTheDocument();
      expect(root, type).toHaveClass(`dfc-ddh--${type}`);
      unmount();
    }
  });

  it('defaults to text-helper and renders both lines', () => {
    const { container } = render(
      <DropdownHeader text="Jese Leos" secondaryText="name@DEFCON.com" />,
    );
    expect(container.querySelector('.dfc-ddh')).toHaveClass('dfc-ddh--text-helper');
    expect(screen.getByText('Jese Leos')).toBeInTheDocument();
    expect(screen.getByText('name@DEFCON.com')).toBeInTheDocument();
  });

  it('renders the avatar and badge for with-avatar', () => {
    const { container } = render(
      <DropdownHeader
        type="with-avatar"
        avatar={<img data-testid="avatar" alt="" />}
        text="Jese Leos"
        secondaryText="name@DEFCON.com"
        badge="PRO"
      />,
    );
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(container.querySelector('.dfc-ddh__badge')).toHaveTextContent('PRO');
  });

  it('renders a chevron for selector and no badge', () => {
    const { container } = render(<DropdownHeader type="selector" text="Jese Leos" badge="PRO" />);
    expect(container.querySelector('.dfc-ddh__glyph')).toBeInTheDocument();
    expect(container.querySelector('.dfc-ddh__badge')).not.toBeInTheDocument();
  });

  it('lets the selector glyph be overridden', () => {
    render(<DropdownHeader type="selector" text="a" trailingIcon={<svg data-testid="custom" />} />);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('renders the actions slot for big-avatar', () => {
    render(
      <DropdownHeader
        type="big-avatar"
        avatar={<img data-testid="avatar" alt="" />}
        text="Hello, Jese Leos"
        secondaryText="name@DEFCON.com"
        actions={<button type="button">Sign out</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    expect(screen.getByText('Hello, Jese Leos')).toBeInTheDocument();
  });

  it('renders a search field for form and reports changes', () => {
    const onValueChange = vi.fn();
    render(<DropdownHeader type="form" onValueChange={onValueChange} />);

    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(input).toHaveAttribute('placeholder', 'Search');

    fireEvent.change(input, { target: { value: 'jese' } });
    expect(onValueChange).toHaveBeenCalledWith('jese');
  });

  it('honours a custom placeholder', () => {
    render(<DropdownHeader type="form" placeholder="Find a person" />);
    expect(screen.getByRole('searchbox', { name: 'Find a person' })).toBeInTheDocument();
  });

  it('does not render a badge or search field for text-helper', () => {
    const { container } = render(<DropdownHeader text="Jese Leos" badge="PRO" />);
    expect(container.querySelector('.dfc-ddh__badge')).not.toBeInTheDocument();
    expect(container.querySelector('.dfc-ddh__field')).not.toBeInTheDocument();
  });
});
