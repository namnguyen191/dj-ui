import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

export const ZTextStyles = z.strictObject({
  align: z.enum(['left', 'center', 'right']).optional(),
  weight: z.number().optional(),
  size: z.number().optional(),
  underline: z.boolean().optional(),
  backgroundColor: z.string().optional(),
});
export type TextStyles = z.infer<typeof ZTextStyles>;

export const ZTextType = z.enum(['title', 'paragraph', 'list']);

export const ZBaseTextBlock = z.strictObject({
  type: ZTextType.optional().default('paragraph'),
  styles: ZTextStyles.optional(),
  id: z.string().optional(),
});

export const ZTitleTextBlock = ZBaseTextBlock.extend({
  type: ZTextType.extract(['title']),
  text: z.string(),
});
export const ZParagraphTextBlock = ZBaseTextBlock.extend({
  type: ZTextType.extract(['paragraph']),
  text: z.string(),
});
export const ZListStyles = z.enum([
  'circle',
  'disc',
  'square',
  'armenian',
  'cjk-ideographic',
  'decimal',
  'decimal-leading-zero',
  'georgian',
  'hebrew',
  'hiragana',
  'hiragana-iroha',
  'katakana',
  'katakana-iroha',
  'lower-alpha',
  'lower-greek',
  'lower-latin',
  'lower-roman',
  'upper-alpha',
  'upper-greek',
  'upper-latin',
  'upper-roman',
]);
export const ZListTextBlock = ZBaseTextBlock.extend({
  type: ZTextType.extract(['list']),
  title: z.string().optional(),
  items: z.array(z.string()),
  listStyle: ZListStyles.optional().default('circle'),
});

export const ZTextBlockConfigOption = z.union([
  ZTitleTextBlock,
  ZParagraphTextBlock,
  ZListTextBlock,
]);
export type TextBlockConfigOption = z.input<typeof ZTextBlockConfigOption>;

export const ZTextBlocksConfigOption = z.array(ZTextBlockConfigOption);
export type TextBlocksConfigOption = z.input<typeof ZTextBlocksConfigOption>;

export const ZSimpleTextConfigs = z.strictObject({
  textBlocks: ZTextBlocksConfigOption,
});

export type SimpleTextConfigs = z.input<typeof ZSimpleTextConfigs>;

export const ZSimpleTextUIESchema = createUIElementTemplateSchema(ZSimpleTextConfigs).describe(
  'PrimeNgSimpleTextUIESchema'
);
