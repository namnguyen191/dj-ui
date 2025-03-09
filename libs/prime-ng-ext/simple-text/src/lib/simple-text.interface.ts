import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

export const ZTextStyles = z.strictObject({
  align: z.enum(['left', 'center', 'right']).optional(),
  weight: z.number().optional(),
  size: z.number().optional(),
  underline: z.boolean().optional(),
});
export type TextStyles = z.infer<typeof ZTextStyles>;

export const ZTextBlockConfigOption = z.strictObject({
  text: z.string(),
  type: z.enum(['title', 'paragraph']).optional().default('paragraph'),
  styles: ZTextStyles.optional(),
});
export type TextBlockConfigOption = z.input<typeof ZTextBlockConfigOption>;

export const ZTextBlocksConfigOption = z.array(ZTextBlockConfigOption);
export type TextBlocksConfigOption = z.input<typeof ZTextBlocksConfigOption>;

export const ZSimpleTextConfigs = z.strictObject({
  textBlocks: ZTextBlocksConfigOption,
});

export type SimpleTextConfigs = z.input<typeof ZSimpleTextConfigs>;

export const ZSimpleTextUIE = createUIElementTemplateSchema(ZSimpleTextConfigs).describe(
  'PrimeNgSimpleTextUIESchema'
);
