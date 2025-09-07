/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  generateAppRRTSchemas,
  generateAppUIESchemas,
  ZAddToStateActionHook,
  ZHttpFetcher,
  ZNavigateActionHook,
  ZSingleFileUploadFetcher,
  ZTriggerRemoteResourceActionHook,
} from '@dj-ui/common';
import { ZSimpleGridLayoutUIESchema } from '@dj-ui/common/shared';
import { type RemoteResourceTemplate, type UIElementTemplate } from '@dj-ui/core';
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
  .extend(ZTimeStamp.shape)
  .extend(ZMetaData.shape);
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

const appActionHooks = [
  ZAddToStateActionHook,
  ZTriggerRemoteResourceActionHook,
  ZNavigateActionHook,
];

// Let TS infer the type here
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createAppUIEEditTemplate = (originalTemplate: z.ZodObject) => {
  return originalTemplate
    .omit({
      id: true,
      type: true,
    })
    .extend(ZMetaData.shape);
};

const appSchemas = generateAppUIESchemas({
  uieSchemas: [
    ZSimpleTableUIESchema,
    ZSimpleTextUIESchema,
    ZSimpleImageUIESchema,
    ZImagesCarouselUIESchema,
    ZSimpleGridLayoutUIESchema,
    ZCardUIESchema,
  ],
  actionHookSchemas: appActionHooks,
});

export const ZAppEditSimpleTableUIESchema = createAppUIEEditTemplate(appSchemas[0]!).describe(
  'AppEditPrimeNgSimpleTableUIESchema'
);
export const ZAppEditSimpleTextUIESchema = createAppUIEEditTemplate(appSchemas[1]!).describe(
  'AppEditPrimeNgSimpleTextUIESchema'
);
export const ZAppEditSimpleImageUIESchema = createAppUIEEditTemplate(appSchemas[2]!).describe(
  'AppEditPrimeNgSimpleImageUIESchema'
);
export const ZAppEditImagesCarouselUIESchema = createAppUIEEditTemplate(appSchemas[3]!).describe(
  'AppEditPrimeNgImagesCarouselUIESchema'
);
export const ZAppEditSimpleGridUIESchema = createAppUIEEditTemplate(appSchemas[4]!).describe(
  'AppEditSimpleGridUIESchema'
);
export const ZAppEditCardUIESchema = createAppUIEEditTemplate(appSchemas[5]!).describe(
  'AppEditPrimeNgCardUIESchema'
);

export const ZAppEditRemoteResourceSchema = generateAppRRTSchemas({
  zRequests: [ZHttpFetcher, ZSingleFileUploadFetcher],
  zActionHooks: appActionHooks,
})
  .omit({
    id: true,
  })
  .describe('AppEditRemoteResourceSchema');
