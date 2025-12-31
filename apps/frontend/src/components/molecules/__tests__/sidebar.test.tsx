import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Sidebar from '../sidebar';

const theme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>{component}</BrowserRouter>
    </ThemeProvider>,
  );
};

describe('Sidebar', () => {
  it('should render without crashing', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Sidebar open={false} collapseSidebar={handleCollapse} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display collapse button', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Sidebar open={false} collapseSidebar={handleCollapse} />);

    const collapseButton = screen.getByRole('button');
    expect(collapseButton).toBeInTheDocument();
  });

  it('should call collapseSidebar when collapse button is clicked', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Sidebar open={false} collapseSidebar={handleCollapse} />);

    const collapseButton = screen.getByRole('button');
    fireEvent.click(collapseButton);

    expect(handleCollapse).toHaveBeenCalledTimes(1);
  });

  it('should display Range builder link', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Sidebar open={true} collapseSidebar={handleCollapse} />);

    expect(screen.getByText('Range builder')).toBeInTheDocument();
  });

  it('should display Scenarios link', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Sidebar open={true} collapseSidebar={handleCollapse} />);

    expect(screen.getByText('Scenarios')).toBeInTheDocument();
  });

  it('should link to /range', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Sidebar open={true} collapseSidebar={handleCollapse} />,
    );

    const rangeLink = container.querySelector('a[href="/range"]');
    expect(rangeLink).toBeInTheDocument();
  });

  it('should link to /scenarios', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Sidebar open={true} collapseSidebar={handleCollapse} />,
    );

    const scenariosLink = container.querySelector('a[href="/scenarios"]');
    expect(scenariosLink).toBeInTheDocument();
  });

  it('should display icons for navigation items', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Sidebar open={true} collapseSidebar={handleCollapse} />,
    );

    const icons = container.querySelectorAll('.MuiListItemIcon-root svg');
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it('should render with closed state', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Sidebar open={false} collapseSidebar={handleCollapse} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with open state', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Sidebar open={true} collapseSidebar={handleCollapse} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have navigation list', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Sidebar open={true} collapseSidebar={handleCollapse} />,
    );

    const navList = container.querySelector('nav');
    expect(navList).toBeInTheDocument();
  });

  it('should have dividers', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Sidebar open={true} collapseSidebar={handleCollapse} />,
    );

    const dividers = container.querySelectorAll('hr');
    expect(dividers.length).toBeGreaterThan(0);
  });
});
