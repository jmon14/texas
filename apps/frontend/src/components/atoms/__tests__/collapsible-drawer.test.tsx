import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CollapsibleDrawer from '../collapsible-drawer';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('CollapsibleDrawer', () => {
  it('should be a styled MUI Drawer component', () => {
    // CollapsibleDrawer is a styled component based on MUI Drawer
    // It extends Drawer with custom styling for collapsing behavior
    expect(CollapsibleDrawer).toBeDefined();
  });

  it('should accept required props', () => {
    // Test that component accepts the required props without throwing
    expect(() => {
      renderWithTheme(
        <CollapsibleDrawer open={false} width={240} variant="permanent">
          <div>Content</div>
        </CollapsibleDrawer>,
      );
    }).not.toThrow();
  });

  it('should accept open prop', () => {
    expect(() => {
      renderWithTheme(
        <CollapsibleDrawer open={true} width={240} variant="permanent">
          <div>Content</div>
        </CollapsibleDrawer>,
      );
    }).not.toThrow();
  });

  it('should accept width prop', () => {
    expect(() => {
      renderWithTheme(
        <CollapsibleDrawer open={false} width={300} variant="permanent">
          <div>Content</div>
        </CollapsibleDrawer>,
      );
    }).not.toThrow();
  });

  it('should accept drawer variant prop', () => {
    expect(() => {
      renderWithTheme(
        <CollapsibleDrawer open={false} width={240} variant="temporary">
          <div>Content</div>
        </CollapsibleDrawer>,
      );
    }).not.toThrow();
  });

  it('should accept drawer anchor prop', () => {
    expect(() => {
      renderWithTheme(
        <CollapsibleDrawer open={false} width={240} variant="permanent" anchor="left">
          <div>Content</div>
        </CollapsibleDrawer>,
      );
    }).not.toThrow();
  });

  it('should render with different open states', () => {
    expect(() => {
      const { rerender } = renderWithTheme(
        <CollapsibleDrawer open={false} width={240} variant="permanent">
          <div>Content</div>
        </CollapsibleDrawer>,
      );

      rerender(
        <ThemeProvider theme={theme}>
          <CollapsibleDrawer open={true} width={240} variant="permanent">
            <div>Content</div>
          </CollapsibleDrawer>
        </ThemeProvider>,
      );
    }).not.toThrow();
  });
});
