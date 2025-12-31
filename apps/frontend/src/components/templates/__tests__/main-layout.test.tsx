import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainLayout from '../main-layout';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('MainLayout', () => {
  const mockRenderHeader = jest.fn((_isOpen: boolean, _toggle: () => void) => (
    <div>Header Content</div>
  ));

  const mockRenderSidebar = jest.fn((_isOpen: boolean, _toggle: () => void) => (
    <div>Sidebar Content</div>
  ));

  it('should render with header, sidebar, and children', () => {
    renderWithTheme(
      <MainLayout renderHeader={mockRenderHeader} renderSidebar={mockRenderSidebar}>
        <div>Main Content</div>
      </MainLayout>,
    );

    expect(screen.getByText('Header Content')).toBeInTheDocument();
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('should render children in main content area', () => {
    renderWithTheme(
      <MainLayout renderHeader={mockRenderHeader} renderSidebar={mockRenderSidebar}>
        <div data-testid="child-content">Test Child</div>
      </MainLayout>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should call renderHeader and renderSidebar with correct props', () => {
    renderWithTheme(
      <MainLayout renderHeader={mockRenderHeader} renderSidebar={mockRenderSidebar}>
        <div>Content</div>
      </MainLayout>,
    );

    // Verify render functions were called
    expect(mockRenderHeader).toHaveBeenCalled();
    expect(mockRenderSidebar).toHaveBeenCalled();

    // Verify they received boolean and function args
    const headerCall = mockRenderHeader.mock.calls[0];
    const sidebarCall = mockRenderSidebar.mock.calls[0];

    expect(typeof headerCall[0]).toBe('boolean');
    expect(typeof headerCall[1]).toBe('function');
    expect(typeof sidebarCall[0]).toBe('boolean');
    expect(typeof sidebarCall[1]).toBe('function');
  });
});
