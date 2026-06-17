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
});
