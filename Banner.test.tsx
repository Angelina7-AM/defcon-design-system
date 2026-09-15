import { fireEvent, render, screen } from '@testing-library/react';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders its children', () => {
    render(<Banner>New brand identity has been launched.</Banner>);
    expect(screen.getByText('New brand identity has been launched.')).toBeInTheDocument();
  });

  it('applies type and position classes', () => {
    const { container } = render(
      <Banner type="secret" position="fixed-top">
        Service disruption in progress.
      </Banner>,
    );
    const banner = container.querySelector('.dfc-banner');
    expect(banner).toHaveClass(
      'dfc-banner',
      'dfc-banner--secret',
      'dfc-banner--classified',
      'dfc-banner--fixed-top',
    );
  });

  it('defaults to the static default type', () => {
    const { container } = render(<Banner>Default</Banner>);
    const banner = container.querySelector('.dfc-banner');
    expect(banner).toHaveClass('dfc-banner--default');
    expect(banner).not.toHaveClass(
      'dfc-banner--classified',
      'dfc-banner--fixed-top',
      'dfc-banner--fixed-bottom',
    );
  });

  it('renders the prescribed label for each classification marking', () => {
    const cases = [
      ['unclassified', 'Unclassified'],
      ['controlled-cui', 'Controlled (CUI)'],
      ['confidential', 'Confidential'],
      ['secret', 'Secret'],
      ['top-secret', 'Top Secret'],
      ['top-secret-sci', 'Top Secret/SCI'],
    ] as const;

    for (const [type, label] of cases) {
      const { unmount } = render(<Banner type={type} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });

  it('lets children override a classification label', () => {
    render(<Banner type="secret">Secret // NOFORN</Banner>);
    expect(screen.getByText('Secret // NOFORN')).toBeInTheDocument();
    expect(screen.queryByText('Secret', { exact: true })).not.toBeInTheDocument();
  });

  it('renders the leading chip by default and omits it when showIcon is false', () => {
    const { container, rerender } = render(<Banner>With icon</Banner>);
    expect(container.querySelector('.dfc-banner__chip')).toBeInTheDocument();

    rerender(<Banner showIcon={false}>No icon</Banner>);
    expect(container.querySelector('.dfc-banner__chip')).not.toBeInTheDocument();
  });

  it('renders a custom leading icon when provided', () => {
    const { container } = render(<Banner icon={<svg data-testid="icon" />}>With icon</Banner>);
    expect(container.querySelector('.dfc-banner__chip')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders heading and description for the heading-description type', () => {
    render(
      <Banner type="heading-description" heading="Integration is the key">
        You can integrate DEFCON with many tools.
      </Banner>,
    );
    expect(screen.getByText('Integration is the key')).toBeInTheDocument();
    expect(screen.getByText('You can integrate DEFCON with many tools.')).toBeInTheDocument();
  });

  it('renders a trailing link for the icon-link type', () => {
    render(
      <Banner type="icon-link" linkLabel="Become a partner" linkHref="/partners">
        Get 2% pricing commission.
      </Banner>,
    );
    const link = screen.getByRole('link', { name: /Become a partner/ });
    expect(link).toHaveAttribute('href', '/partners');
  });

  it('renders a labelled email field and submits for the newsletter type', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <Banner
        type="newsletter"
        fieldLabel="First name"
        fieldRequired
        onSubmit={onSubmit}
        actions={<button type="submit">Subscribe</button>}
      />,
    );

    const input = screen.getByLabelText(/First name/);
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('placeholder', 'Enter your email');

    // The field is required, so an empty form is blocked by constraint
    // validation — fill it before submitting.
    fireEvent.change(input, { target: { value: 'ops@defconai.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders the brand marks for the logo-button type', () => {
    const { container } = render(
      <Banner type="logo-button">Build websites even faster with DEFCON.</Banner>,
    );
    expect(container.querySelector('.dfc-banner__wordmark')).toBeInTheDocument();
    expect(container.querySelector('.dfc-banner__mark')).toBeInTheDocument();
    expect(screen.getByText('Build websites even faster with DEFCON.')).toBeInTheDocument();
  });

  it('renders composed actions content', () => {
    render(
      <Banner type="heading-description" heading="Integration is the key" actions={<button type="button">Learn more</button>}>
        Description
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
