import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Sidebar from '../sidebar';

const theme = createTheme();

const meta: Meta<typeof Sidebar> = {
  title: 'Molecules/Sidebar',
  component: Sidebar,
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Drawer
            variant="permanent"
            open={context.args.open}
            sx={{
              width: 240,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 240,
                boxSizing: 'border-box',
              },
            }}
          >
            <Story />
          </Drawer>
        </BrowserRouter>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the sidebar is expanded',
    },
    collapseSidebar: {
      description: 'Callback to collapse the sidebar',
    },
  },
  args: {
    collapseSidebar: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Expanded: Story = {
  args: {
    open: true,
  },
};

export const Collapsed: Story = {
  args: {
    open: false,
  },
};
