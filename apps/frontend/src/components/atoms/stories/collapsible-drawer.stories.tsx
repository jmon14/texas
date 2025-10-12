// External libraries
import { grey } from '@mui/material/colors';
import { Meta, StoryObj } from '@storybook/react';

// Components
import CollapsibleDrawerComp from '../collapsible-drawer';

const meta: Meta<typeof CollapsibleDrawerComp> = {
  title: 'Atoms/CollapsibleDrawer',
  component: CollapsibleDrawerComp,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Collapsible drawer state',
    },
    width: {
      control: 'number',
      description: 'Width of the drawer',
    },
  },
  args: {
    open: true,
    width: 240,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: grey[100],
          height: 'calc(100vh)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CollapsibleDrawerComp>;

export const CollapsibleDrawer: Story = {
  args: {
    variant: 'permanent',
    anchor: 'left',
  },
};
