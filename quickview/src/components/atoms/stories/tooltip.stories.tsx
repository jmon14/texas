import { Meta, StoryObj } from '@storybook/react';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';

const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  argTypes: {
    title: {
      control: 'text',
      description: 'The title to display inside the tooltip.',
    },
    placement: {
      control: 'select',
      options: [
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top',
      ],
      description: 'The placement of the tooltip.',
    },
    arrow: {
      control: 'boolean',
      description: 'If true, adds an arrow to the tooltip.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    title: 'Tooltip text',
    placement: 'top',
    arrow: true,
    children: <Button>Hover me</Button>,
  },
};

export const BottomPlacement: Story = {
  args: {
    title: 'Tooltip text',
    placement: 'bottom',
    arrow: true,
    children: <Button>Hover me</Button>,
  },
};

export const NoArrow: Story = {
  args: {
    title: 'Tooltip text',
    placement: 'top',
    arrow: false,
    children: <Button>Hover me</Button>,
  },
};
