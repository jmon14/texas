import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CenterLayout from '../center-layout';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('CenterLayout', () => {
  const mockRenderToolbar = jest.fn(() => <div>Toolbar Content</div>);

  it('should render with toolbar and children', () => {
    renderWithTheme(
      <CenterLayout renderToolbar={mockRenderToolbar}>
        <div>Center Content</div>
      </CenterLayout>,
    );

    expect(screen.getByText('Toolbar Content')).toBeInTheDocument();
    expect(screen.getByText('Center Content')).toBeInTheDocument();
  });

  it('should render children in centered panel', () => {
    renderWithTheme(
      <CenterLayout renderToolbar={mockRenderToolbar}>
        <div data-testid="child-content">Test Child</div>
      </CenterLayout>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should call renderToolbar function', () => {
    renderWithTheme(
      <CenterLayout renderToolbar={mockRenderToolbar}>
        <div>Content</div>
      </CenterLayout>,
    );

    expect(mockRenderToolbar).toHaveBeenCalled();
  });

  it('should render multiple children', () => {
    renderWithTheme(
      <CenterLayout renderToolbar={mockRenderToolbar}>
        <div>First Child</div>
        <div>Second Child</div>
      </CenterLayout>,
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });
});
