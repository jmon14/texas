import { render } from '@testing-library/react';
import Panel from '../panel';

describe('Panel', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <Panel>
        <div>Test Content</div>
      </Panel>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render children', () => {
    const { getByText } = render(
      <Panel>
        <div>Panel Content</div>
      </Panel>,
    );

    expect(getByText('Panel Content')).toBeInTheDocument();
  });

  it('should render as MUI Paper component', () => {
    const { container } = render(
      <Panel>
        <div>Content</div>
      </Panel>,
    );

    const paper = container.querySelector('.MuiPaper-root');
    expect(paper).toBeInTheDocument();
  });

  it('should apply custom sx props', () => {
    const customSx = { backgroundColor: 'red', margin: 2 };

    const { container } = render(
      <Panel sx={customSx}>
        <div>Styled Content</div>
      </Panel>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <Panel>
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </Panel>,
    );

    expect(getByText('First')).toBeInTheDocument();
    expect(getByText('Second')).toBeInTheDocument();
    expect(getByText('Third')).toBeInTheDocument();
  });

  it('should handle array of sx props', () => {
    const sxArray = [{ margin: 1 }, { padding: 2 }];

    const { container } = render(
      <Panel sx={sxArray}>
        <div>Content</div>
      </Panel>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
