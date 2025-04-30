import { Injectable } from '@angular/core';
import { IdbService } from '@dj-ui/utils';
import type { UnionToTuple } from 'type-fest';

import type { AppRemoteResourceTemplate, AppUIElementTemplate } from '../shared/dj-ui-app-template';

export const DB_NAME = 'DJ_UI_LOCAL_DB';
export const DB_VERSION = 2;
export type StoresMap = {
  uiElementTemplates: AppUIElementTemplate;
  remoteResourceTemplates: AppRemoteResourceTemplate;
};
export const ALL_STORES: UnionToTuple<keyof StoresMap> = [
  'uiElementTemplates',
  'remoteResourceTemplates',
];

@Injectable({
  providedIn: 'root',
})
export class AppIdbService extends IdbService<StoresMap> {
  constructor() {
    super({
      stores: ALL_STORES,
      dbName: DB_NAME,
      dbVersion: DB_VERSION,
    });
  }
}
