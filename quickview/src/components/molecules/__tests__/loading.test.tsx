// External libraries
import { screen } from '@testing-library/react';

// Test utils
import { renderWithProviders } from '../../../utils/test-utils';

// Components
import Loading from '../loading';

// Constants
import { FetchStatus } from '../../../constants';

describe('loading component', () => {
  it(`should be rendered when status is loading`, () => {
    // Render Loading component
    renderWithProviders(<Loading />, {
      preloadedState: { user: { error: null, user: undefined, status: FetchStatus.LOADING } },
    });

    // Expect Loading to be rendered
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it(`shouldn't be rendered when status isn't loading`, () => {
    // Render Loading component
    renderWithProviders(<Loading />);

    // Expect Loading to not be rendered
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
