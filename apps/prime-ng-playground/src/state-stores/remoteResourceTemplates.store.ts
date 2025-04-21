/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { computed, inject } from '@angular/core';
import { withEntitiesAndLoaders } from '@dj-ui/utils';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import type { AppRemoteResourceTemplate, TemplateInfo } from '../shared/app-template';
import {
  type CreateAppRemoteResourceTemplatePayload,
  RemoteResourceTemplateAPIService,
  type UpdateAppRemoteResourceTemplatePayload,
} from '../shared/services/remote-resource-template-api.service';

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
  >((remoteResourceTemplateAPIService = inject(RemoteResourceTemplateAPIService)) => ({
    fetchAll: () =>
      firstValueFrom(remoteResourceTemplateAPIService.getAllRemoteResourceTemplates()),
    fetch: (id) => firstValueFrom(remoteResourceTemplateAPIService.fetchRemoteResourceTemplate(id)),
    create: (createPayload) =>
      firstValueFrom(remoteResourceTemplateAPIService.createRemoteResourceTemplate(createPayload)),
    update: (updatePayload) =>
      firstValueFrom(remoteResourceTemplateAPIService.updateRemoteResourceTemplate(updatePayload)),
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

      return entities().filter((rrTemp) => {
        if (id) {
          return rrTemp.id === id;
        }

        return false;
      });
    }),
  })),
  withMethods(
    (store, remoteResourceTemplateAPIService = inject(RemoteResourceTemplateAPIService)) => ({
      updateQuery: (query: RemoteResourceTemplatesStoreState['query']): void => {
        patchState(store, { query });
      },
      resetMockTemplates: async (): Promise<void> => {
        await remoteResourceTemplateAPIService.resetExampleTemplates();
        await store.loadAll();
      },
    })
  ),
  withHooks({
    onInit: async ({ loadAll }) => {
      await loadAll();
    },
  })
);
