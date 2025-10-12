// External libraries
import { grey } from '@mui/material/colors';
import { StoryObj, Meta } from '@storybook/react';

// Components
import FullCenter from '../center';

const meta: Meta<typeof FullCenter> = {
  title: 'Atoms/Center',
  component: FullCenter,
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: grey[100],
          height: 'calc(100vh - 32px)',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FullCenter>;

export const Center: Story = {
  args: {
    children: 'Centered item',
  },
};
