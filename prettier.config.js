/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'html',
      },
    },
    {
      files: '*.component.html',
      options: {
        parser: 'angular',
      },
    },
  ],
};

export default config;
