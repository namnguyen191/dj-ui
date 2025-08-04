import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

import { ImagesCarouselElementType, ZImagesCarouselConfigs } from './images-carousel.interface';
import { SimpleImageElementType, ZSimpleImageConfigs } from './simple-image.interface';

export const CardElementType = 'CARD';
export const CardSymbol = Symbol('Card');

export const ZInLineSimpleImage = z.strictObject({
  type: z.literal(SimpleImageElementType),
  configs: ZSimpleImageConfigs.partial(),
});
export const ZInLineImagesCarousel = z.strictObject({
  type: z.literal(ImagesCarouselElementType),
  configs: ZImagesCarouselConfigs.partial(),
});
export const ZTemplateId = z.strictObject({
  templateId: z.string(),
});
export const ZTopBannerConfigOption = z.union([
  ZTemplateId,
  ZInLineSimpleImage,
  ZInLineImagesCarousel,
]);
export type TopBannerConfigOption = z.infer<typeof ZTopBannerConfigOption>;

export const ZTitleConfigOption = z.string();
export type TitleConfigOption = z.infer<typeof ZTitleConfigOption>;

export const ZSubTitleConfigOption = z.string();
export type SubTitleConfigOption = z.infer<typeof ZSubTitleConfigOption>;

export const ZBodyConfigOption = z.string();
export type BodyConfigOption = z.infer<typeof ZBodyConfigOption>;

export const ZCardConfigs = z.strictObject({
  topBanner: ZTopBannerConfigOption.optional(),
  title: ZTitleConfigOption.optional(),
  subTitle: ZSubTitleConfigOption.optional(),
  body: ZBodyConfigOption.optional(),
});

export type CardConfigs = z.input<typeof ZCardConfigs>;

export const ZCardUIESchema =
  createUIElementTemplateSchema(ZCardConfigs).describe('PrimeNgCardUIESchema');

export type ZCardUIETemplate = z.infer<typeof ZCardUIESchema>;
