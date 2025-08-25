import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';

import { TableComponent } from './table.component';

const meta: Meta<TableComponent> = {
  component: TableComponent,
  title: 'TableComponent',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TableComponent>;

export const Primary: Story = {
  args: {
    label: 'My default label',
  },
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/table works!/gi)).toBeTruthy();
  },
};
