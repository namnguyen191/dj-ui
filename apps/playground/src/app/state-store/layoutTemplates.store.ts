import { computed, inject, untracked } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';

import {
  CreateAppLayoutTemplatePayload,
  LayoutTemplatesAPIService,
  UpdateAppLayoutTemplatePayload,
} from '../services/layout-templates-api.service';
import { AppLayoutTemplate, TemplateInfo } from '../shared/dj-ui-app-template';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from './request-status-store-feature';

type LayoutTemplatesStoreState = {
  query: {
    id?: string;
  };
};
const layoutTemplatesStoreInitialState: LayoutTemplatesStoreState = {
  query: {},
};

export const LayoutTemplatesStore = signalStore(
  { providedIn: 'root' },
  withState(layoutTemplatesStoreInitialState),
  withEntities<AppLayoutTemplate>(),
  withRequestStatus(),
  withComputed(({ entities, query }) => ({
    allLayoutTemplatesInfo: computed<TemplateInfo[]>(() => {
      return entities().map(({ id, createdAt, updatedAt, name, description }) => ({
        id,
        createdAt,
        updatedAt,
        name,
        description,
      }));
    }),
    filteredLayoutTemplates: computed<AppLayoutTemplate[]>(() => {
      const { id } = query();

      return entities().filter((uiEleTemp) => {
        if (id) {
          return uiEleTemp.id === id;
        }

        return false;
      });
    }),
  })),
  withMethods((store, layoutTemplatesAPIService = inject(LayoutTemplatesAPIService)) => ({
    loadAll: async (): Promise<void> => {
      patchState(store, setPending());
      try {
        const allLayoutTemplates = await firstValueFrom(
          layoutTemplatesAPIService.getAllLayoutTemplates()
        );
        patchState(store, setAllEntities(allLayoutTemplates), setFulfilled());
      } catch (_error) {
        setError('Something went wrong fetching layout templates');
      }
    },
    addOne: async (newLayoutTemplatePayload: CreateAppLayoutTemplatePayload): Promise<void> => {
      patchState(store, setPending());
      try {
        const createdLayoutTemplate = await firstValueFrom(
          layoutTemplatesAPIService.createLayoutTemplate(newLayoutTemplatePayload)
        );
        patchState(store, setEntity(createdLayoutTemplate));
      } catch (_error) {
        setError('Something went wrong creating layout template');
      } finally {
        patchState(store, setFulfilled());
      }
    },
    updateOne: async (
      updateLayoutTemplatePayload: UpdateAppLayoutTemplatePayload
    ): Promise<void> => {
      patchState(store, setPending());
      try {
        const updatedLayoutTemplate = await firstValueFrom(
          layoutTemplatesAPIService.updateLayoutTemplate(updateLayoutTemplatePayload)
        );
        patchState(store, setEntity(updatedLayoutTemplate));
      } catch (_error) {
        setError('Something went wrong updating layout template');
      } finally {
        patchState(store, setFulfilled());
      }
    },
    updateQuery: (query: LayoutTemplatesStoreState['query']): void => {
      patchState(store, { query });
    },
    getOne: async (id: string): Promise<AppLayoutTemplate> => {
      const allLayoutTemplates = untracked(store.entities);
      const existing = allLayoutTemplates.find((tpl) => tpl.id === id);
      if (existing) {
        return existing;
      }

      patchState(store, setPending());
      const fetched = await firstValueFrom(layoutTemplatesAPIService.fetchLayoutTemplate(id));
      patchState(store, setEntity(fetched), setFulfilled());
      return fetched;
    },
  }))
);
