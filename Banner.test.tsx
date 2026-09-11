import { fireEvent, render, screen } from '@testing-library/react';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders its children', () => {
    render(<Banner>New brand identity has been launched.</Banner>);
    expect(screen.getByText('New brand identity has been launched.')).toBeInTheDocument();
  });

  it('applies variant and position classes', () => {
    const { container } = render(
      <Banner variant="danger" position="fixed-top">
        Service disruption in progress.
      </Banner>,
    );
    const banner = container.querySelector('.dfc-banner');
    expect(banner).toHaveClass('dfc-banner', 'dfc-banner--danger', 'dfc-banner--fixed-top');
  });

  it('defaults to the neutral static variant', () => {
    const { container } = render(<Banner>Default</Banner>);
    const banner = container.querySelector('.dfc-banner');
    expect(banner).toHaveClass('dfc-banner--neutral');
    expect(banner).not.toHaveClass('dfc-banner--fixed-top', 'dfc-banner--fixed-bottom');
  });

  it('renders a leading icon when provided', () => {
    const { container } = render(
      <Banner icon={<svg data-testid="icon" />}>With icon</Banner>,
    );
    expect(container.querySelector('.dfc-banner__icon')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders composed actions content', () => {
    render(
      <Banner actions={<button type="button">Learn more</button>}>
        Integration is the key
      </Banner>,
    );
    expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument();
  });

  it('renders a dismiss button and fires onDismiss when clicked', () => {
    const onDismiss = vi.fn();
    render(
      <Banner onDismiss={onDismiss} dismissLabel="Close banner">
        Dismissible
      </Banner>,
    );
    const dismissButton = screen.getByRole('button', { name: 'Close banner' });
    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('omits the dismiss button when onDismiss is not provided', () => {
    render(<Banner>No dismiss</Banner>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
