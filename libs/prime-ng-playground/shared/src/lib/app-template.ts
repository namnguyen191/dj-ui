import { ZSimpleGridLayoutUIESchema } from '@dj-ui/common/shared';
import {
  type RemoteResourceTemplate,
  type UIElementTemplate,
  ZRemoteResourceTemplate,
} from '@dj-ui/core';
import {
  ZCardUIESchema,
  ZImagesCarouselUIESchema,
  ZSimpleImageUIESchema,
  ZSimpleTableUIESchema,
  ZSimpleTextUIESchema,
} from '@dj-ui/prime-ng-ext/shared';
import { z } from 'zod';

export const ZTimeStamp = z.strictObject({
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});
export type TimeStamp = z.infer<typeof ZTimeStamp>;

export const ZMetaData = z.strictObject({
  name: z.string(),
  description: z.string(),
});
export type MetaData = z.infer<typeof ZMetaData>;

export const ZTemplateInfo = z
  .strictObject({
    id: z.string(),
  })
  .merge(ZTimeStamp)
  .merge(ZMetaData);
export type TemplateInfo = z.infer<typeof ZTemplateInfo>;

export type AppUIElementTemplate = UIElementTemplate & TimeStamp & MetaData;
export type CreateAppUIElementTemplate<T extends UIElementTemplate> = T & TimeStamp & MetaData;
export type AppUIElementTemplateUnEditableFields = TimeStamp &
  Pick<AppUIElementTemplate, 'id' | 'type'>;
export type AppUIElementTemplateEditableFields = Omit<
  AppUIElementTemplate,
  keyof AppUIElementTemplateUnEditableFields
>;

export type AppRemoteResourceTemplate = RemoteResourceTemplate & TimeStamp & MetaData;
export type AppRemoteResourceTemplateUnEditableFields = TimeStamp &
  Pick<AppRemoteResourceTemplate, 'id'>;
export type AppRemoteResourceTemplateEditableFields = Omit<
  AppRemoteResourceTemplate,
  keyof AppRemoteResourceTemplateUnEditableFields
>;

// Let TS infer the type here
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createAppUIEEditTemplate = (originalTemplate: z.AnyZodObject) => {
  return originalTemplate
    .omit({
      id: true,
      type: true,
    })
    .merge(ZMetaData);
};

export const ZAppEditSimpleTableUIESchema = createAppUIEEditTemplate(
  ZSimpleTableUIESchema
).describe('AppEditPrimeNgSimpleTableUIESchema');
export const ZAppEditSimpleTextUIESchema = createAppUIEEditTemplate(ZSimpleTextUIESchema).describe(
  'AppEditPrimeNgSimpleTextUIESchema'
);
export const ZAppEditSimpleImageUIESchema = createAppUIEEditTemplate(
  ZSimpleImageUIESchema
).describe('AppEditPrimeNgSimpleImageUIESchema');
export const ZAppEditImagesCarouselUIESchema = createAppUIEEditTemplate(
  ZImagesCarouselUIESchema
).describe('AppEditPrimeNgImagesCarouselUIESchema');
export const ZAppEditSimpleGridUIESchema = createAppUIEEditTemplate(
  ZSimpleGridLayoutUIESchema
).describe('AppEditSimpleGridUIESchema');
export const ZAppEditCardUIESchema = createAppUIEEditTemplate(ZCardUIESchema).describe(
  'AppEditPrimeNgCardUIESchema'
);

export const ZAppEditRemoteResourceSchema = ZRemoteResourceTemplate.omit({
  id: true,
})
  .merge(ZMetaData)
  .describe('AppEditRemoteResourceSchema');
