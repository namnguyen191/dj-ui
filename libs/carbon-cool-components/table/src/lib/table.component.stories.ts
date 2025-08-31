import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';

import { type Column, TableComponent } from './table.component';

const meta: Meta<TableComponent> = {
  component: TableComponent,
  title: 'TableComponent',
  // tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TableComponent>;

const defaultData = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

const defaultColumns: Column[] = [
  {
    id: 'firstName',
    label: 'First name',
  },
  {
    id: 'lastName',
    label: 'Last name',
  },
  {
    id: 'age',
    label: 'Age',
  },
];

export const Primary: Story = {
  args: {
    data: defaultData,
    columns: defaultColumns,
  },
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/table works!/gi)).toBeTruthy();
  },
};
