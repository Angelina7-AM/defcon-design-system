import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders a nav landmark containing an ordered list', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
        <BreadcrumbItem hideSeparator>Flowbite</BreadcrumbItem>
      </Breadcrumb>,
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
    expect(nav.querySelector('ol')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders crumbs with an href as links', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem hideSeparator>Projects</BreadcrumbItem>
      </Breadcrumb>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the last item without href as non-link text with aria-current', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem hideSeparator>Flowbite</BreadcrumbItem>
      </Breadcrumb>,
    );
    const current = screen.getByText('Flowbite');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).toBe('SPAN');
    expect(screen.queryByRole('link', { name: 'Flowbite' })).not.toBeInTheDocument();
    expect(current.closest('li')).toHaveClass('dfc-breadcrumb-item', 'dfc-breadcrumb-item--current');
  });

  it('applies the size class to the list', () => {
    const { container } = render(
      <Breadcrumb size="sm">
        <BreadcrumbItem hideSeparator>Home</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(container.querySelector('ol')).toHaveClass('dfc-breadcrumb__list', 'dfc-breadcrumb__list--sm');
  });
});
