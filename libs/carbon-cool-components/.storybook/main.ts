import type { StorybookConfig } from '@storybook/angular';

const config = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  framework: {
    name: '@storybook/angular',
    options: {
      builder: {
        viteConfigPath: 'vite.config.mts',
      },
    },
  },
  // docs: {
  //   autodocs: true,
  //   defaultName: 'Docs',
  // },
} as StorybookConfig;

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
