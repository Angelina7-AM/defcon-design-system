import { fireEvent, render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant and size classes', () => {
    render(
      <Badge variant="danger" size="lg">
        Failed
      </Badge>,
    );
    const badge = screen.getByText('Failed').closest('.dfc-badge');
    expect(badge).toHaveClass('dfc-badge', 'dfc-badge--danger', 'dfc-badge--lg');
  });

  it('defaults to the neutral sm variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default').closest('.dfc-badge');
    expect(badge).toHaveClass('dfc-badge--neutral', 'dfc-badge--sm');
  });

  it('renders a status dot when dot is set', () => {
    const { container } = render(<Badge dot>Online</Badge>);
    expect(container.querySelector('.dfc-badge__dot')).toBeInTheDocument();
  });

  it('renders secondary text separated from the label', () => {
    render(<Badge secondaryText="12">Views</Badge>);
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders a dismiss button and fires onDismiss when clicked', () => {
    const onDismiss = vi.fn();
    render(
      <Badge onDismiss={onDismiss} dismissLabel="Remove tag">
        Removable
      </Badge>,
    );
    const dismissButton = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('omits the label in icon-only mode', () => {
    render(
      <Badge iconOnly dot aria-label="Status">
        Hidden label
      </Badge>,
    );
    expect(screen.queryByText('Hidden label')).not.toBeInTheDocument();
  });
});
