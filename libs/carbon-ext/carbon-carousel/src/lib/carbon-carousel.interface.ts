import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

export const ZImageUrlsConfigOption = z.array(
  z.string({
    error: () => ({ message: 'Image url must be a string' }),
  }),
  {
    error: () => ({ message: 'Image urls must be a an array string' }),
  }
);
export type ImageUrlsConfigOption = z.infer<typeof ZImageUrlsConfigOption>;

export const ZAriaLabelConfigOption = z.string({
  error: () => ({ message: 'Aria label must be a string' }),
});
export type AriaLabelConfigOption = z.infer<typeof ZAriaLabelConfigOption>;

export const ZCarouselConfigs = z.object({
  imageUrls: ZImageUrlsConfigOption,
  ariaLabel: ZAriaLabelConfigOption,
});
export type CarouselConfigs = z.infer<typeof ZCarouselConfigs>;

export const ZCarbonCarouselForJsonSchema = createUIElementTemplateSchema(ZCarouselConfigs, []);

export type CarbonCarouselTypeForJsonSchema = z.infer<typeof ZCarbonCarouselForJsonSchema>;
