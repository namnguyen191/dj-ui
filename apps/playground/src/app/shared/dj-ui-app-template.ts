import type { LayoutTemplate, RemoteResourceTemplate, UIElementTemplate } from '@dj-ui/core';
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
export type AppUIElementTemplateUnEditableFields = TimeStamp & Pick<AppUIElementTemplate, 'id'>;
export type AppUIElementTemplateEditableFields = Omit<
  AppUIElementTemplate,
  keyof AppUIElementTemplateUnEditableFields
>;

export type AppLayoutTemplate = LayoutTemplate & TimeStamp & MetaData;
export type AppLayoutTemplateUnEditableFields = TimeStamp & Pick<AppLayoutTemplate, 'id'>;
export type AppLayoutTemplateEditableFields = Omit<
  AppLayoutTemplate,
  keyof AppLayoutTemplateUnEditableFields
>;

export type AppRemoteResourceTemplate = RemoteResourceTemplate & TimeStamp & MetaData;
export type AppRemoteResourceTemplateUnEditableFields = TimeStamp &
  Pick<AppRemoteResourceTemplate, 'id'>;
export type AppRemoteResourceTemplateEditableFields = Omit<
  AppRemoteResourceTemplate,
  keyof AppRemoteResourceTemplateUnEditableFields
>;
