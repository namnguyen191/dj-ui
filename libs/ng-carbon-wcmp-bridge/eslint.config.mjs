import baseAngularConfig from '../../eslint-angular.config.mjs';
import { depsCheckIgnoredList } from '../../eslint.config.mjs';
import jsonParser from 'jsonc-eslint-parser';

export default [
  ...baseAngularConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: [...depsCheckIgnoredList, 'lit'],
        },
      ],
    },
    languageOptions: { parser: jsonParser },
  },
];
