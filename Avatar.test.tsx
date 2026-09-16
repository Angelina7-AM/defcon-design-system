import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup, AvatarGroupLabel } from './Avatar';

describe('Avatar', () => {
  it('renders an image when src is given', () => {
    render(<Avatar src="https://example.com/photo.jpg" alt="Jese Leos" />);
    const img = screen.getByRole('img', { name: 'Jese Leos' });
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('falls back to initials when there is no src', () => {
    render(<Avatar initials="JL" />);
    expect(screen.getByText('JL')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders children instead of initials when both are given', () => {
    render(<Avatar initials="JL">custom</Avatar>);
    expect(screen.getByText('custom')).toBeInTheDocument();
    expect(screen.queryByText('JL')).not.toBeInTheDocument();
  });

  it('applies the size class', () => {
    const { container } = render(<Avatar initials="JL" size="lg" />);
    expect(container.firstChild).toHaveClass('dfc-avatar', 'dfc-avatar--lg');
  });

  it('renders a status dot with an accessible label', () => {
    render(<Avatar initials="JL" status="online" />);
    expect(screen.getByRole('img', { name: 'Online' })).toHaveClass('dfc-avatar__dot--online');
  });

  it('does not render a status dot by default', () => {
    const { container } = render(<Avatar initials="JL" />);
    expect(container.querySelector('.dfc-avatar__dot')).not.toBeInTheDocument();
  });

  it('renders a remove button that calls onRemove when clicked', () => {
    const onRemove = vi.fn();
    render(<Avatar initials="JL" removable onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe('AvatarGroup', () => {
  it('renders all avatars when count is within max', () => {
    render(
      <AvatarGroup>
        <Avatar initials="AA" />
        <Avatar initials="BB" />
      </AvatarGroup>,
    );
    expect(screen.getByText('AA')).toBeInTheDocument();
    expect(screen.getByText('BB')).toBeInTheDocument();
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it('collapses extra avatars into a "+N" counter when over max', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar initials="AA" />
        <Avatar initials="BB" />
        <Avatar initials="CC" />
        <Avatar initials="DD" />
      </AvatarGroup>,
    );
    expect(screen.getByText('AA')).toBeInTheDocument();
    expect(screen.getByText('BB')).toBeInTheDocument();
    expect(screen.queryByText('CC')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('applies the size class and propagates size to child avatars', () => {
    const { container } = render(
      <AvatarGroup size="lg">
        <Avatar initials="AA" />
      </AvatarGroup>,
    );
    expect(container.firstChild).toHaveClass('dfc-avatar-group', 'dfc-avatar-group--lg');
    expect(screen.getByText('AA').closest('.dfc-avatar')).toHaveClass('dfc-avatar--lg');
  });
});

describe('AvatarGroupLabel', () => {
  it('renders the avatar, name, and helper text', () => {
    render(
      <AvatarGroupLabel
        avatar={<Avatar initials="JL" />}
        name="Jese Leos"
        helper="jese@defcon.ai"
      />,
    );
    expect(screen.getByText('JL')).toBeInTheDocument();
    expect(screen.getByText('Jese Leos')).toBeInTheDocument();
    expect(screen.getByText('jese@defcon.ai')).toBeInTheDocument();
  });

  it('omits helper text when not given', () => {
    render(<AvatarGroupLabel avatar={<Avatar initials="JL" />} name="Jese Leos" />);
    expect(screen.getByText('Jese Leos')).toBeInTheDocument();
    expect(screen.queryByText('jese@defcon.ai')).not.toBeInTheDocument();
  });
});
