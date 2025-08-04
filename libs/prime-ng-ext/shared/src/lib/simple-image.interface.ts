import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

export const SimpleImageElementType = 'SIMPLE_IMAGE';
export const SimpleImageSymbol = Symbol('SimpleImage');

export const ZImageUrlConfigOption = z.string({
  error: () => ({ message: 'Image url must be a string' }),
});
export type ImageUrlConfigOption = z.infer<typeof ZImageUrlConfigOption>;

export const ZAltLabelConfigOption = z.string({
  error: () => ({ message: 'Aria label must be a string' }),
});
export type AltLabelConfigOption = z.infer<typeof ZAltLabelConfigOption>;

export const ZPriorityConfigOption = z.boolean({
  error: () => ({ message: 'Priority must be a boolean' }),
});
export type PriorityConfigOption = z.infer<typeof ZPriorityConfigOption>;

export const ZSimpleImageConfigs = z.object({
  imageUrl: ZImageUrlConfigOption.optional(),
  altLabel: ZAltLabelConfigOption.optional(),
  priority: ZPriorityConfigOption.optional(),
});
export type SimpleImageConfigs = z.infer<typeof ZSimpleImageConfigs>;

export const ZSimpleImageUIESchema = createUIElementTemplateSchema(ZSimpleImageConfigs).describe(
  'PrimeNgSimpleImageUIESchema'
);
export type SimpleImageUIESchema = z.infer<typeof ZSimpleImageUIESchema>;
