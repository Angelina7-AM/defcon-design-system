import { fireEvent, render, screen } from '@testing-library/react';
import { Accordion, AccordionItem } from './Accordion';

describe('Accordion', () => {
  it('renders items closed by default', () => {
    render(
      <Accordion>
        <AccordionItem title="Question one">Answer one</AccordionItem>
        <AccordionItem title="Question two">Answer two</AccordionItem>
      </Accordion>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    }
    expect(screen.getByText('Answer one')).not.toBeVisible();
    expect(screen.getByText('Answer two')).not.toBeVisible();
  });

  it('honors defaultOpen on an individual item', () => {
    render(
      <Accordion>
        <AccordionItem title="Question one" defaultOpen>
          Answer one
        </AccordionItem>
        <AccordionItem title="Question two">Answer two</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'Question one' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Question two' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByText('Answer one')).toBeVisible();
  });

  it('clicking a header toggles aria-expanded and panel visibility', () => {
    render(
      <Accordion>
        <AccordionItem title="Question one">Answer one</AccordionItem>
      </Accordion>,
    );
    const button = screen.getByRole('button', { name: 'Question one' });
    const panel = screen.getByText('Answer one');

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeVisible();

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toBeVisible();

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeVisible();
  });

  it('links the header button and panel via aria-controls/aria-labelledby', () => {
    render(
      <Accordion>
        <AccordionItem title="Question one">Answer one</AccordionItem>
      </Accordion>,
    );
    const button = screen.getByRole('button', { name: 'Question one' });
    const panel = screen.getByText('Answer one').closest('[role="region"]') as HTMLElement;

    expect(panel).not.toBeNull();
    expect(button).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', button.id);
  });

  it('allows multiple items open at once by default', () => {
    render(
      <Accordion>
        <AccordionItem title="Question one">Answer one</AccordionItem>
        <AccordionItem title="Question two">Answer two</AccordionItem>
      </Accordion>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Question one' }));
    fireEvent.click(screen.getByRole('button', { name: 'Question two' }));

    expect(screen.getByRole('button', { name: 'Question one' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Question two' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes a previously-open sibling when collapseSiblings is set', () => {
    render(
      <Accordion collapseSiblings>
        <AccordionItem title="Question one" defaultOpen>
          Answer one
        </AccordionItem>
        <AccordionItem title="Question two">Answer two</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'Question one' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Question two' }));

    expect(screen.getByRole('button', { name: 'Question one' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Question two' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('supports fully controlled open state via openItems/onOpenChange', () => {
    render(
      <Accordion openItems={['a']} onOpenChange={() => {}}>
        <AccordionItem id="a" title="Question one">
          Answer one
        </AccordionItem>
        <AccordionItem id="b" title="Question two">
          Answer two
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'Question one' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    // Clicking calls onOpenChange but the parent doesn't update openItems in
    // this test, so the controlled value stays put (proves the component
    // isn't secretly managing its own state once controlled).
    fireEvent.click(screen.getByRole('button', { name: 'Question two' }));
    expect(screen.getByRole('button', { name: 'Question one' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Question two' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('does not toggle a disabled item', () => {
    render(
      <Accordion>
        <AccordionItem title="Question one" disabled>
          Answer one
        </AccordionItem>
      </Accordion>,
    );
    const button = screen.getByRole('button', { name: 'Question one' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies the variant class to items', () => {
    render(
      <Accordion variant="cards">
        <AccordionItem title="Question one">Answer one</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText('Question one').closest('.dfc-accordion-item')).toHaveClass(
      'dfc-accordion-item--cards',
    );
  });
});
