// External libraries
import { Meta, StoryObj } from '@storybook/react';
import { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Components
import LoadingComp from '../../../components/molecules/loading';

// Store
import { RootState, setupStore } from '../../../store/store';

// Constants
import { FetchStatus } from '../../../constants';

const loadingState: PreloadedState<RootState> = {
  user: { user: undefined, error: null, status: FetchStatus.LOADING },
};

const meta: Meta<typeof LoadingComp> = {
  title: 'Molecules/Loading',
  component: LoadingComp,
  decorators: [
    (Story) => (
      <Provider store={setupStore(loadingState)}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LoadingComp>;

export const Loading: Story = {};
