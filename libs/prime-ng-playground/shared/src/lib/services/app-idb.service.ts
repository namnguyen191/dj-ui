import { Injectable } from '@angular/core';
import { IdbService } from '@dj-ui/utils';
import type { UnionToTuple } from 'type-fest';

import type {
  AppLayoutTemplate,
  AppRemoteResourceTemplate,
  AppUIElementTemplate,
} from '../app-template.ts';

export const DB_NAME = 'PRIME_NG_PLAYGROUND_LOCAL_DB';
export const DB_VERSION = 1;
export type StoresMap = {
  appLayoutTemplates: AppLayoutTemplate;
  appUIElementTemplates: AppUIElementTemplate;
  appRemoteResourceTemplates: AppRemoteResourceTemplate;
};
export const ALL_STORES: UnionToTuple<keyof StoresMap> = [
  'appLayoutTemplates',
  'appUIElementTemplates',
  'appRemoteResourceTemplates',
];

@Injectable({
  providedIn: 'root',
})
export class AppIdbService extends IdbService<StoresMap, keyof StoresMap> {
  constructor() {
    super({
      stores: ALL_STORES,
      dbName: DB_NAME,
      dbVersion: DB_VERSION,
    });
  }
}
