/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import {
  CreateAppRemoteResourceTemplatePayload,
  RemoteResourceTemplatesAPIService,
  UpdateAppRemoteResourceTemplatePayload,
} from '../services/remote-resource-templates-api.service';
import { AppRemoteResourceTemplate, TemplateInfo } from '../shared/dj-ui-app-template';
import { withEntitiesAndLoaders } from './entities-and-loaders.store-feat';

type RemoteResourceTemplatesStoreState = {
  query: {
    id?: string;
  };
};
const remoteResourceTemplatesStoreInitialState: RemoteResourceTemplatesStoreState = {
  query: {},
};

export const RemoteResourceTemplatesStore = signalStore(
  { providedIn: 'root' },
  withState(remoteResourceTemplatesStoreInitialState),
  withEntitiesAndLoaders<
    AppRemoteResourceTemplate,
    CreateAppRemoteResourceTemplatePayload,
    UpdateAppRemoteResourceTemplatePayload
  >((remoteResourceTemplatesAPIService = inject(RemoteResourceTemplatesAPIService)) => ({
    fetchAll: () =>
      firstValueFrom(remoteResourceTemplatesAPIService.getAllRemoteResourceTemplates()),
    fetch: (id) =>
      firstValueFrom(remoteResourceTemplatesAPIService.fetchRemoteResourceTemplate(id)),
    create: (createPayload) =>
      firstValueFrom(remoteResourceTemplatesAPIService.createRemoteResourceTemplate(createPayload)),
    update: (updatePayload) =>
      firstValueFrom(remoteResourceTemplatesAPIService.updateRemoteResourceTemplate(updatePayload)),
  })),
  withComputed(({ entities, query }) => ({
    allRemoteResourceTemplatesInfo: computed<TemplateInfo[]>(() => {
      return entities().map(({ id, createdAt, updatedAt, name, description }) => ({
        id,
        createdAt,
        updatedAt,
        name,
        description,
      }));
    }),
    filteredRemoteResourceTemplates: computed<AppRemoteResourceTemplate[]>(() => {
      const { id } = query();

      return entities().filter((uiEleTemp) => {
        if (id) {
          return uiEleTemp.id === id;
        }

        return false;
      });
    }),
  })),
  withMethods((store) => ({
    updateQuery: (query: RemoteResourceTemplatesStoreState['query']): void => {
      patchState(store, { query });
    },
  }))
);
