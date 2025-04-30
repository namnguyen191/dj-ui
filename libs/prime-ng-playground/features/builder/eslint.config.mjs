import baseAngularConfig from '../../../../eslint-angular.config.mjs';

export default [
  ...baseAngularConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'prime-ng-playground-builder-feat',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'prime-ng-playground-builder-feat',
          style: 'kebab-case',
        },
      ],
    },
  },
];
