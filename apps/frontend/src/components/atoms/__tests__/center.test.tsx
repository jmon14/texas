import { render } from '@testing-library/react';
import FullCenter from '../center';

describe('FullCenter', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <FullCenter>
        <div>Test Content</div>
      </FullCenter>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render children', () => {
    const { getByText } = render(
      <FullCenter>
        <div>Centered Content</div>
      </FullCenter>,
    );

    expect(getByText('Centered Content')).toBeInTheDocument();
  });

  it('should apply flexbox centering styles', () => {
    const { container } = render(
      <FullCenter>
        <div>Content</div>
      </FullCenter>,
    );

    const element = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(element);

    expect(styles.display).toBe('flex');
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <FullCenter>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </FullCenter>,
    );

    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
    expect(getByText('Child 3')).toBeInTheDocument();
  });

  it('should render with nested components', () => {
    const { getByText } = render(
      <FullCenter>
        <div>
          <span>Nested Content</span>
        </div>
      </FullCenter>,
    );

    expect(getByText('Nested Content')).toBeInTheDocument();
  });
});
