import { computed, inject, untracked } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';

import {
  CreateAppRemoteResourceTemplatePayload,
  RemoteResourceTemplatesAPIService,
  UpdateAppRemoteResourceTemplatePayload,
} from '../services/remote-resource-templates-api.service';
import { AppRemoteResourceTemplate, TemplateInfo } from '../shared/dj-ui-app-template';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from './request-status-store-feature';

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
  withEntities<AppRemoteResourceTemplate>(),
  withRequestStatus(),
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
  withMethods(
    (store, remoteResourceTemplatesAPIService = inject(RemoteResourceTemplatesAPIService)) => ({
      loadAll: async (): Promise<void> => {
        patchState(store, setPending());
        try {
          const allRemoteResourceTemplates = await firstValueFrom(
            remoteResourceTemplatesAPIService.getAllRemoteResourceTemplates()
          );
          patchState(store, setAllEntities(allRemoteResourceTemplates), setFulfilled());
        } catch (_error) {
          setError('Something went wrong fetching remote resource templates');
        }
      },
      addOne: async (
        newRemoteResourceTemplatePayload: CreateAppRemoteResourceTemplatePayload
      ): Promise<void> => {
        patchState(store, setPending());
        try {
          const createdRemoteResourceTemplate = await firstValueFrom(
            remoteResourceTemplatesAPIService.createRemoteResourceTemplate(
              newRemoteResourceTemplatePayload
            )
          );
          patchState(store, setEntity(createdRemoteResourceTemplate));
        } catch (_error) {
          setError('Something went wrong creating remote resource template');
        } finally {
          patchState(store, setFulfilled());
        }
      },
      updateOne: async (
        updateRemoteResourceTemplatePayload: UpdateAppRemoteResourceTemplatePayload
      ): Promise<void> => {
        patchState(store, setPending());
        try {
          const updatedRemoteResourceTemplate = await firstValueFrom(
            remoteResourceTemplatesAPIService.updateRemoteResourceTemplate(
              updateRemoteResourceTemplatePayload
            )
          );
          patchState(store, setEntity(updatedRemoteResourceTemplate));
        } catch (_error) {
          setError('Something went wrong updating remote resource template');
        } finally {
          patchState(store, setFulfilled());
        }
      },
      updateQuery: (query: RemoteResourceTemplatesStoreState['query']): void => {
        patchState(store, { query });
      },
      getOne: async (id: string): Promise<AppRemoteResourceTemplate> => {
        const allTemplates = untracked(store.entities);
        const existingTemplate = allTemplates.find((tpl) => tpl.id === id);
        if (existingTemplate) {
          return existingTemplate;
        }

        patchState(store, setPending());
        const fetched = await firstValueFrom(
          remoteResourceTemplatesAPIService.fetchRemoteResourceTemplate(id)
        );
        patchState(store, setEntity(fetched), setFulfilled());
        return fetched;
      },
    })
  )
);
