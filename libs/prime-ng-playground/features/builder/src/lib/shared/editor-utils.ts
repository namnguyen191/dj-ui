import type { Plugin } from 'prettier';
import * as parserBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettier from 'prettier/standalone';

export const formatJSON = async (rawJSON: string): Promise<string> => {
  const formatted = await prettier.format(rawJSON, {
    parser: 'json',
    plugins: [parserBabel, prettierPluginEstree as Plugin],
  });

  return formatted;
};
