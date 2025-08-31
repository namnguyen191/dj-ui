// import { setCompodocJson } from '@storybook/addon-docs/angular';
import { componentWrapperDecorator, type Preview } from '@storybook/angular';

// import docJson from '../documentation.json';

// setCompodocJson(docJson);

type MenuItem = {
  value: string;
  title: string;
  right?: string;
  icon?: string;
};

const themeMenuItems: MenuItem[] = [
  {
    title: 'Light',
    value: 'cds-theme-zone-white',
    right: 'white',
  },
  {
    title: 'Light Gray',
    value: 'cds-theme-zone-g10',
    right: 'g10',
  },
  {
    title: 'Dark Gray',
    value: 'cds-theme-zone-g90',
    right: 'g90',
  },
  {
    title: 'Dark',
    value: 'cds-theme-zone-g100',
    right: 'g100',
  },
];

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        // The label to show for this toolbar item
        title: 'Theme',
        icon: 'circlehollow',
        // Array of plain string values or MenuItem shape (see below)
        items: themeMenuItems,
      },
    },
  },
  initialGlobals: {
    theme: themeMenuItems[0]?.value,
  },
  decorators: [
    componentWrapperDecorator(
      (story) => `<div [class]="myTheme">${story}</div>`,
      ({ globals }) => {
        return { myTheme: globals['theme'] as string };
      }
    ),
  ],
};

export default preview;
