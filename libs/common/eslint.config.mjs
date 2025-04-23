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
          prefix: 'djuiCommon',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'dj-ui-common',
          style: 'kebab-case',
        },
      ],
    },
  },
];
