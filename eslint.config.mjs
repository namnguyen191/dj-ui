import nxEslintPlugin from '@nx/eslint-plugin';
import nx from '@nx/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import jsonParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  {
    ignores: [
      '**/prettier.config.js',
      '**/node_modules',
      '**/eslint*.js',
      '**/eslint*.mjs',
      '**/lint-staged.config.js',
      '**/generated-json-schemas/**',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/documentation.json',
    ],
  },
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    plugins: {
      '@nx': nxEslintPlugin,
      prettier: eslintPluginPrettier,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
  },
  {
    rules: {
      'prettier/prettier': ['error'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:data-access',
                'type:backend',
                'type:util',
                'type:feat',
              ],
            },
            {
              sourceTag: 'type:feat',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util', 'type:data-access'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:util', 'type:ui'],
            },
            {
              sourceTag: 'scope:dj-ui-core',
              onlyDependOnLibsWithTags: ['scope:dj-ui-core'],
            },
            {
              sourceTag: 'scope:dj-ui-common',
              onlyDependOnLibsWithTags: ['scope:dj-ui-common', 'scope:dj-ui-core'],
            },
            {
              sourceTag: 'scope:dj-ui-extension',
              onlyDependOnLibsWithTags: ['scope:dj-ui-core', 'scope:dj-ui-common'],
            },
            {
              sourceTag: 'scope:prime-ng-playground',
              onlyDependOnLibsWithTags: [
                'scope:prime-ng-playground',
                'scope:dj-ui-extension',
                'scope:dj-ui-core',
                'scope:shared',
              ],
            },
            {
              sourceTag: 'design-system:carbon',
              onlyDependOnLibsWithTags: [
                'design-system:carbon',
                'design-system:generic',
                'type:util',
              ],
            },
            {
              sourceTag: 'design-system:prime-ng',
              onlyDependOnLibsWithTags: [
                'design-system:prime-ng',
                'design-system:generic',
                'type:util',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      indent: 'off',
      'comma-dangle': 'off',
      'no-extra-semi': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
            '@analogjs/vitest-angular',
            '@angular/platform-browser',
          ],
        },
      ],
    },
    languageOptions: { parser: jsonParser },
  },
  eslintConfigPrettier,
]);
