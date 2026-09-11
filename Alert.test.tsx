import { fireEvent, render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders its children with role="alert"', () => {
    render(<Alert>Something happened</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('defaults to the neutral variant', () => {
    render(<Alert>Default message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('dfc-alert', 'dfc-alert--neutral');
  });

  it('applies variant classes', () => {
    render(<Alert variant="danger">Failed to save</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('dfc-alert--danger');
  });

  it('applies the accent modifier for the border-top treatment', () => {
    render(
      <Alert variant="warning" accent>
        Heads up
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveClass('dfc-alert--accent');
  });

  it('renders a heading and marks the alert complex when provided', () => {
    render(
      <Alert variant="success" heading="Alert heading">
        Body message
      </Alert>,
    );
    expect(screen.getByText('Alert heading')).toBeInTheDocument();
    expect(screen.getByText('Body message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('dfc-alert--complex');
  });

  it('renders a default severity icon', () => {
    const { container } = render(<Alert variant="info">Heads up</Alert>);
    expect(container.querySelector('.dfc-alert__icon-slot svg')).toBeInTheDocument();
  });

  it('omits the icon slot when icon is set to null', () => {
    const { container } = render(
      <Alert variant="info" icon={null}>
        No icon here
      </Alert>,
    );
    expect(container.querySelector('.dfc-alert__icon-slot')).not.toBeInTheDocument();
  });

  it('renders a dismiss button and fires onDismiss when clicked', () => {
    const onDismiss = vi.fn();
    render(
      <Alert onDismiss={onDismiss} dismissLabel="Close alert">
        Dismissible
      </Alert>,
    );
    const dismissButton = screen.getByRole('button', { name: 'Close alert' });
    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render a dismiss button when onDismiss is omitted', () => {
    render(<Alert>No dismiss</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
