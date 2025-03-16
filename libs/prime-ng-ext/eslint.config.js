import baseAngularConfig from '../../eslint-angular.config.js';
import jsonParser from 'jsonc-eslint-parser';

export default [
  ...baseAngularConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'dj-ui-prime-ng',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: [
            '@nx/devkit',
            'vite',
            '@analogjs/vite-plugin-angular',
            '@nx/vite',
            '@angular/compiler',
            'zod-to-json-schema',
          ],
        },
      ],
    },
    languageOptions: { parser: jsonParser },
  },
];
