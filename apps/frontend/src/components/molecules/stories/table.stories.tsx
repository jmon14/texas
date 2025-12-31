import { Meta, StoryObj } from '@storybook/react';
import Table from '../table';

const meta: Meta<typeof Table> = {
  title: 'Molecules/Table',
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface GameStats {
  hand: string;
  wins: number;
  losses: number;
  winRate: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
];

const mockGameStats: GameStats[] = [
  { hand: 'AA', wins: 120, losses: 30, winRate: '80%' },
  { hand: 'KK', wins: 100, losses: 40, winRate: '71%' },
  { hand: 'QQ', wins: 85, losses: 45, winRate: '65%' },
  { hand: 'AK', wins: 75, losses: 55, winRate: '58%' },
];

export const UserTable: Story = {
  args: {
    rows: mockUsers,
  },
};

export const GameStatsTable: Story = {
  args: {
    rows: mockGameStats,
  },
};

export const SingleRow: Story = {
  args: {
    rows: [mockUsers[0]],
  },
};
