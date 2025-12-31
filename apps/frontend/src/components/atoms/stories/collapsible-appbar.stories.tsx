// External libraries
import Toolbar from '@mui/material/Toolbar';
import { Meta, StoryObj } from '@storybook/react';

// Components
import CollapseAppbar from '../collapsible-appbar';

const meta: Meta<typeof CollapseAppbar> = {
  title: 'Atoms/CollapsibleAppbar',
  component: CollapseAppbar,
  argTypes: {
    open: {
      description: 'Collapsible appbar state',
    },
    width: {
      description: 'Length of collapse',
    },
  },
  args: {
    open: false,
    width: 240,
  },
};

export default meta;

type Story = StoryObj<typeof CollapseAppbar>;

export const CollapsibleAppbar: Story = {
  args: {
    children: (
      <Toolbar>
        <div>Collapsible Appbar</div>
      </Toolbar>
    ),
    position: 'relative',
  },
};
