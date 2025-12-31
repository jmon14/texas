import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CollapsibleAppbar from '../collapsible-appbar';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('CollapsibleAppbar', () => {
  it('should render without crashing', () => {
    const { container } = renderWithTheme(
      <CollapsibleAppbar width={240}>
        <div>AppBar Content</div>
      </CollapsibleAppbar>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render children', () => {
    const { getByText } = renderWithTheme(
      <CollapsibleAppbar width={240}>
        <div>Test Content</div>
      </CollapsibleAppbar>,
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should render as MUI AppBar', () => {
    const { container } = renderWithTheme(
      <CollapsibleAppbar width={240}>
        <div>Content</div>
      </CollapsibleAppbar>,
    );

    const appBar = container.querySelector('.MuiAppBar-root');
    expect(appBar).toBeInTheDocument();
  });

  it('should accept width prop', () => {
    const { container } = renderWithTheme(
      <CollapsibleAppbar width={300}>
        <div>Content</div>
      </CollapsibleAppbar>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle open state', () => {
    const { container } = renderWithTheme(
      <CollapsibleAppbar open={true} width={240}>
        <div>Content</div>
      </CollapsibleAppbar>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle closed state', () => {
    const { container } = renderWithTheme(
      <CollapsibleAppbar open={false} width={240}>
        <div>Content</div>
      </CollapsibleAppbar>,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should forward AppBar props', () => {
    const { container } = renderWithTheme(
      <CollapsibleAppbar width={240} position="fixed" color="primary">
        <div>Content</div>
      </CollapsibleAppbar>,
    );

    const appBar = container.querySelector('.MuiAppBar-root');
    expect(appBar).toBeInTheDocument();
  });
});
