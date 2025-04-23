import baseAngularConfig from '../../eslint-angular.config.mjs';

export default [
  ...baseAngularConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'djui',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'dj-ui',
          style: 'kebab-case',
        },
      ],
    },
  },
];
