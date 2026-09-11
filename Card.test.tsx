import { render, screen } from '@testing-library/react';
import { Card, CardRow, CardRowStat, CardStatus } from './Card';

describe('Card', () => {
  it('renders its children in the body', () => {
    render(<Card>Body content</Card>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('applies the default vertical orientation class', () => {
    const { container } = render(<Card>Body</Card>);
    expect(container.querySelector('.dfc-card')).toHaveClass('dfc-card', 'dfc-card--vertical');
  });

  it('applies the horizontal orientation class', () => {
    const { container } = render(<Card orientation="horizontal">Body</Card>);
    expect(container.querySelector('.dfc-card')).toHaveClass('dfc-card--horizontal');
  });

  it('renders the media, header, and footer slots when provided', () => {
    render(
      <Card media={<img alt="preview" src="/preview.png" />} header={<h3>Title</h3>} footer={<button>Read more</button>}>
        Body
      </Card>,
    );
    expect(screen.getByAltText('preview')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Read more' })).toBeInTheDocument();
  });

  it('omits slot wrappers that are not provided', () => {
    const { container } = render(<Card>Body only</Card>);
    expect(container.querySelector('.dfc-card__media')).not.toBeInTheDocument();
    expect(container.querySelector('.dfc-card__header')).not.toBeInTheDocument();
    expect(container.querySelector('.dfc-card__footer')).not.toBeInTheDocument();
  });

  it('marks the body as scrollable when requested', () => {
    const { container } = render(<Card scrollable>Body</Card>);
    expect(container.querySelector('.dfc-card__body')).toHaveClass('dfc-card__body--scrollable');
  });
});

describe('CardStatus', () => {
  it('renders a label with a leading dot by default', () => {
    const { container } = render(<CardStatus>Active</CardStatus>);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(container.querySelector('.dfc-card-status__dot')).toBeInTheDocument();
  });

  it('applies the tone class to the dot', () => {
    const { container } = render(<CardStatus tone="danger">Failed</CardStatus>);
    expect(container.querySelector('.dfc-card-status__dot')).toHaveClass('dfc-card-status__dot--danger');
  });

  it('defaults to the success tone', () => {
    const { container } = render(<CardStatus>Active</CardStatus>);
    expect(container.querySelector('.dfc-card-status__dot')).toHaveClass('dfc-card-status__dot--success');
  });

  it('hides the dot when hideDot is set', () => {
    const { container } = render(<CardStatus hideDot>Active</CardStatus>);
    expect(container.querySelector('.dfc-card-status__dot')).not.toBeInTheDocument();
  });
});

describe('CardRow', () => {
  it('renders the title and subtext', () => {
    render(<CardRow title="Order #1234" subtext="Placed today" />);
    expect(screen.getByText('Order #1234')).toBeInTheDocument();
    expect(screen.getByText('Placed today')).toBeInTheDocument();
  });

  it('renders CardRowStat children in the stats group', () => {
    const { container } = render(
      <CardRow title="Row">
        <CardRowStat value="42" subtext="Units" />
        <CardRowStat value="$100" subtext="Revenue" />
      </CardRow>,
    );
    expect(container.querySelectorAll('.dfc-card-row__stat')).toHaveLength(2);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('renders endContent with an optional endLabel', () => {
    render(
      <CardRow title="Row" endLabel="Priority Status" endContent={<CardStatus>Active</CardStatus>}>
      </CardRow>,
    );
    expect(screen.getByText('Priority Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('omits the end column when endContent is not provided', () => {
    const { container } = render(<CardRow title="Row" />);
    expect(container.querySelector('.dfc-card-row__end')).not.toBeInTheDocument();
  });
});
