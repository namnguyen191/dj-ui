// Avoid using non-function syntax as it will always try to append files at the end of the command
const config = {
  './package.json': [
    (_files) => 'pnpm typecheck:all',
    (_files) => 'pnpm lint:all',
    (_files) => 'pnpm stylelint:all',
    (_files) => 'pnpm build:all',
  ],
  '{apps,libs,tools}/**/*.{ts,tsx}': [
    (_files) => 'pnpm type-check:affected',
    (_files) => 'pnpm check-circular-dep',
  ],
  '{apps,libs,tools}/**/*.{css,scss}': [(_files) => 'pnpm stylelint:affected'],
  '{apps,libs,tools}/**': [(_files) => 'pnpm build:affected'],
  '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json,html}': [
    (files) => `pnpm nx affected:lint --files=${files.join(',')}`,
    (files) => `pnpm nx format:write --files=${files.join(',')}`,
  ],
  '{apps,libs,tools}/**/*.{css,scss}': [
    (files) => `pnpm nx format:write --files=${files.join(',')}`,
  ],
};

export default config;
