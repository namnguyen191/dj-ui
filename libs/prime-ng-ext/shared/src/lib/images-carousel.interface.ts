import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

import { ZSimpleImageConfigs } from './simple-image.interface';

export const ImagesCarouselElementType = 'IMAGES_CAROUSEL';
export const ImagesCarouselSymbol = Symbol('ImagesCarousel');

export const ZImageTemplateId = z.string();
export type ImageTemplateId = z.infer<typeof ZImageTemplateId>;
export const ZEmbeddedImageTemplate = ZSimpleImageConfigs.partial();
export type EmbeddedImageTemplate = z.infer<typeof ZEmbeddedImageTemplate>;
export const ZImageItem = z.union([ZImageTemplateId, ZEmbeddedImageTemplate]);
export type ImageItem = z.infer<typeof ZImageItem>;
export const ZImagesConfigOption = z.array(ZImageItem);
export type ImagesConfigOption = z.infer<typeof ZImagesConfigOption>;

export const ZImagesCarouselConfigs = z.strictObject({
  images: ZImagesConfigOption.optional(),
});

export type ImagesCarouselConfigs = z.input<typeof ZImagesCarouselConfigs>;

export const ZImagesCarouselUIESchema = createUIElementTemplateSchema(
  ZImagesCarouselConfigs
).describe('PrimeNgImagesCarouselUIESchema');

export type ZImagesCarouselUIETemplate = z.infer<typeof ZImagesCarouselUIESchema>;
