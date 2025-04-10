import baseAngularConfig from '../../eslint-angular.config.mjs';

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
];
