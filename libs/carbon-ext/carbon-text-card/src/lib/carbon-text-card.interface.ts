import { createUIElementTemplateSchema } from '@dj-ui/core';
import { z } from 'zod';

export const ZTitleConfigOption = z.string({
  error: () => ({ message: 'Card title must be a string' }),
});
export type TitleConfigOption = z.infer<typeof ZTitleConfigOption>;

export const ZSubTitleConfigOption = z.string({
  error: () => ({ message: 'Card sub title must be a string' }),
});
export type SubTitleConfigOption = z.infer<typeof ZSubTitleConfigOption>;

export const ZAvatarUrlConfigOption = z.string({
  error: () => ({ message: 'Avatar url must be a string' }),
});
export type AvatarUrlConfigOption = z.infer<typeof ZAvatarUrlConfigOption>;

export const ZImageUrlConfigOption = z.string({
  error: () => ({ message: 'Image url must be a string' }),
});
export type ImageUrlConfigOption = z.infer<typeof ZImageUrlConfigOption>;

export const ZBodyConfigOption = z.string({
  error: () => ({ message: 'Card body must be a string' }),
});
export type BodyConfigOption = z.infer<typeof ZBodyConfigOption>;

export const ZClickableConfigOption = z.boolean({
  error: () => ({ message: 'Card clickable config must be a boolean' }),
});
export type ClickableConfigOption = z.infer<typeof ZClickableConfigOption>;

export const ZTextCardConfigs = z.object({
  title: ZTitleConfigOption.optional(),
  subTitle: ZSubTitleConfigOption.optional(),
  avatarUrl: ZAvatarUrlConfigOption.optional(),
  imageUrl: ZImageUrlConfigOption.optional(),
  body: ZBodyConfigOption.optional(),
  clickable: ZClickableConfigOption.optional(),
});
export type TextCardConfigs = z.infer<typeof ZTextCardConfigs>;

export type TextCardEvents = {
  onCardClicked: void;
};

export const ZCarbonTextCardForJsonSchema = createUIElementTemplateSchema(ZTextCardConfigs, [
  'onCardClicked',
]);

export type CarbonTextCardTypeForJsonSchema = z.infer<typeof ZCarbonTextCardForJsonSchema>;
