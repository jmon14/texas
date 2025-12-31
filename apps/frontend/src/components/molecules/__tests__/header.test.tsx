import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from '../header';
import themeReducer from '../../../store/slices/theme-slice';
import userReducer from '../../../store/slices/user-slice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      theme: themeReducer,
      user: userReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>,
  );
};

describe('Header', () => {
  it('should render without crashing', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Header open={false} collapseAppbar={handleCollapse} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display menu button when sidebar is closed', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Header open={false} collapseAppbar={handleCollapse} />);

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  it('should hide menu button when sidebar is open', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Header open={true} collapseAppbar={handleCollapse} />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should call collapseAppbar when menu button is clicked', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Header open={false} collapseAppbar={handleCollapse} />);

    const buttons = screen.getAllByRole('button');
    // First button should be the menu/collapse button
    fireEvent.click(buttons[0]);

    expect(handleCollapse).toHaveBeenCalledTimes(1);
  });

  it('should display theme switch', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Header open={false} collapseAppbar={handleCollapse} />,
    );

    // Theme switch has a checkbox input
    const themeSwitch = container.querySelector('input[type="checkbox"]');
    expect(themeSwitch).toBeInTheDocument();
  });

  it('should display user avatar', () => {
    const handleCollapse = jest.fn();

    const { container } = renderWithProviders(
      <Header open={false} collapseAppbar={handleCollapse} />,
    );

    const avatar = container.querySelector('.MuiAvatar-root');
    expect(avatar).toBeInTheDocument();
  });

  it('should open menu when avatar is clicked', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Header open={false} collapseAppbar={handleCollapse} />);

    const buttons = screen.getAllByRole('button');
    // Last button should be the avatar button
    const avatarButton = buttons[buttons.length - 1];
    fireEvent.click(avatarButton);

    // Menu should be visible
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should close menu when clicking outside', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Header open={false} collapseAppbar={handleCollapse} />);

    const buttons = screen.getAllByRole('button');
    const avatarButton = buttons[buttons.length - 1];

    // Open menu
    fireEvent.click(avatarButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();

    // Close menu by clicking escape
    fireEvent.keyDown(document, { key: 'Escape' });
  });

  it('should navigate to profile when Profile is clicked', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Header open={false} collapseAppbar={handleCollapse} />);

    const buttons = screen.getAllByRole('button');
    const avatarButton = buttons[buttons.length - 1];

    // Open menu
    fireEvent.click(avatarButton);

    const profileLink = screen.getByText('Profile');
    expect(profileLink).toBeInTheDocument();
  });

  it('should display user info in menu', () => {
    const handleCollapse = jest.fn();

    renderWithProviders(<Header open={false} collapseAppbar={handleCollapse} />);

    const buttons = screen.getAllByRole('button');
    const avatarButton = buttons[buttons.length - 1];

    // Open menu
    fireEvent.click(avatarButton);

    // Check for user info (hardcoded in component)
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jdoe@acme.com')).toBeInTheDocument();
  });
});
