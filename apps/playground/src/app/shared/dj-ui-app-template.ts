import { LayoutTemplate, RemoteResourceTemplate, UIElementTemplate } from '@dj-ui/core';
import { EmptyObject, UnknownRecord } from 'type-fest';

export type TimeStamp = {
  createdAt: string;
  updatedAt?: string;
};

export type MetaData = {
  name: string;
  description: string;
};

export type TemplateInfo = { id: string } & TimeStamp & MetaData;

export type AppUIElementTemplate<T extends UnknownRecord = EmptyObject> = UIElementTemplate<T> &
  TimeStamp &
  MetaData;
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
