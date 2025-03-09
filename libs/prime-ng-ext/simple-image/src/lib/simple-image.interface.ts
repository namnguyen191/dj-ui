import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

export const ZImageUrlConfigOption = z.string({
  errorMap: () => ({ message: 'Image url must be a string' }),
});
export type ImageUrlConfigOption = z.infer<typeof ZImageUrlConfigOption>;

export const ZAltLabelConfigOption = z.string({
  errorMap: () => ({ message: 'Aria label must be a string' }),
});
export type AltLabelConfigOption = z.infer<typeof ZAltLabelConfigOption>;

export const ZPriorityConfigOption = z.boolean({
  errorMap: () => ({ message: 'Priority must be a boolean' }),
});
export type PriorityConfigOption = z.infer<typeof ZPriorityConfigOption>;

export const ZSimpleImageConfigs = z.object({
  imageUrl: ZImageUrlConfigOption,
  altLabel: ZAltLabelConfigOption,
  priority: ZPriorityConfigOption,
});
export type SimpleImageConfigs = z.infer<typeof ZSimpleImageConfigs>;

export const ZSimpleImageUIE = createUIElementTemplateSchema(ZSimpleImageConfigs).describe(
  'PrimeNgSimpleImageUIESchema'
);
