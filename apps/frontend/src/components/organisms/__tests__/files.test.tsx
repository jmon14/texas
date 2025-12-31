import { render, screen } from '@testing-library/react';
import Files from '../files';

describe('Files', () => {
  it('should render without crashing', () => {
    const { container } = render(<Files />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render table', () => {
    const { container } = render(<Files />);

    // Table element should be present
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('should display file data', () => {
    render(<Files />);

    // Check if test data is displayed (using getAllByText since "uuid" appears in both header and data)
    const uuidElements = screen.getAllByText('uuid');
    expect(uuidElements.length).toBeGreaterThan(0);
    expect(screen.getByText('test url')).toBeInTheDocument();
    expect(screen.getByText('test key')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    const { container } = render(<Files />);

    // Table headers should be present - check within thead
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
    expect(thead).toHaveTextContent('uuid');
    expect(thead).toHaveTextContent('url');
    expect(thead).toHaveTextContent('key');
  });

  it('should render in centered layout', () => {
    const { container } = render(<Files />);

    // FullCenter is a styled Box with flexbox centering
    // Check for the root element with centering styles
    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toBeInTheDocument();
    const styles = window.getComputedStyle(rootElement);
    expect(styles.display).toBe('flex');
  });

  it('should render within panel', () => {
    const { container } = render(<Files />);

    // Panel (Paper) should be present
    const panel = container.querySelector('.MuiPaper-root');
    expect(panel).toBeInTheDocument();
  });

  it('should render table rows', () => {
    const { container } = render(<Files />);

    // Should have table rows
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should have correct table structure', () => {
    const { container } = render(<Files />);

    // Check for proper table structure
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });
});
