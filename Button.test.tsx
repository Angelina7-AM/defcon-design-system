import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Deploy</Button>);
    expect(screen.getByRole('button', { name: 'Deploy' })).toBeInTheDocument();
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="ghost" size="lg">
        Cancel
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Cancel' });
    expect(btn).toHaveClass('dfc-button', 'dfc-button--ghost', 'dfc-button--lg');
  });

  it('defaults to type="button"', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('type', 'button');
  });

  it('supports the extended Figma-reconciled color variants', () => {
    render(
      <Button variant="danger" size="xl">
        Delete
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Delete' });
    expect(btn).toHaveClass('dfc-button', 'dfc-button--danger', 'dfc-button--xl');
  });

  it('supports the xs size', () => {
    render(<Button size="xs">Tiny</Button>);
    expect(screen.getByRole('button', { name: 'Tiny' })).toHaveClass('dfc-button--xs');
  });

  it('applies the outline modifier class', () => {
    render(<Button outline>Outline</Button>);
    expect(screen.getByRole('button', { name: 'Outline' })).toHaveClass('dfc-button--outline');
  });

  it('does not apply the outline class by default', () => {
    render(<Button>Filled</Button>);
    expect(screen.getByRole('button', { name: 'Filled' })).not.toHaveClass('dfc-button--outline');
  });

  it('applies the icon-only modifier class', () => {
    render(<Button iconOnly aria-label="Like" />);
    expect(screen.getByRole('button', { name: 'Like' })).toHaveClass('dfc-button--icon-only');
  });

  it('renders a spinner and disables the button when loading', () => {
    const { container } = render(<Button loading>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveClass('dfc-button--loading');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector('.dfc-button__spinner')).not.toBeNull();
  });

  it('remains disabled via the native disabled prop without loading', () => {
    render(<Button disabled>Locked</Button>);
    const btn = screen.getByRole('button', { name: 'Locked' });
    expect(btn).toBeDisabled();
    expect(btn).not.toHaveClass('dfc-button--loading');
  });
});
