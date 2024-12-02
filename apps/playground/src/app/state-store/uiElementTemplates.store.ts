import { computed, inject, untracked } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';

import {
  CreateAppUIElementTemplatePayload,
  UIElementTemplatesAPIService,
  UpdateAppUIElementTemplatePayload,
} from '../services/ui-element-templates-api.service';
import { AppUIElementTemplate, TemplateInfo } from '../shared/dj-ui-app-template';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from './request-status-store-feature';

type UIElementTemplatesStoreState = {
  query: {
    id?: string;
  };
};
const uiElementTemplatesStoreInitialState: UIElementTemplatesStoreState = {
  query: {},
};

export const UIElementTemplatesStore = signalStore(
  { providedIn: 'root' },
  withState(uiElementTemplatesStoreInitialState),
  withEntities<AppUIElementTemplate>(),
  withRequestStatus(),
  withComputed(({ entities, query }) => ({
    allUIElementTemplatesInfo: computed<TemplateInfo[]>(() => {
      return entities().map(({ id, createdAt, updatedAt, name, description }) => ({
        id,
        createdAt,
        updatedAt,
        name,
        description,
      }));
    }),
    filteredUIElementTemplates: computed<AppUIElementTemplate[]>(() => {
      const { id } = query();

      return entities().filter((uiEleTemp) => {
        if (id) {
          return uiEleTemp.id === id;
        }

        return false;
      });
    }),
  })),
  withMethods((store, uiElementTemplatesAPIService = inject(UIElementTemplatesAPIService)) => ({
    loadAll: async (): Promise<void> => {
      patchState(store, setPending());
      try {
        const allUIElementTemplates = await firstValueFrom(
          uiElementTemplatesAPIService.getAllUIElementTemplates()
        );
        patchState(store, setAllEntities(allUIElementTemplates), setFulfilled());
      } catch (_error) {
        setError('Something went wrong fetching UI element templates');
      }
    },
    addOne: async (
      newUIElementTemplatePayload: CreateAppUIElementTemplatePayload
    ): Promise<void> => {
      patchState(store, setPending());
      try {
        const createdUIElementTemplate = await firstValueFrom(
          uiElementTemplatesAPIService.createUIElementTemplate(newUIElementTemplatePayload)
        );
        patchState(store, setEntity(createdUIElementTemplate));
      } catch (_error) {
        setError('Something went wrong creating UI element template');
      } finally {
        patchState(store, setFulfilled());
      }
    },
    updateOne: async (
      updateUIElementTemplatePayload: UpdateAppUIElementTemplatePayload
    ): Promise<void> => {
      patchState(store, setPending());
      try {
        const updatedUIElementTemplate = await firstValueFrom(
          uiElementTemplatesAPIService.updateUIElementTemplate(updateUIElementTemplatePayload)
        );
        patchState(store, setEntity(updatedUIElementTemplate));
      } catch (_error) {
        setError('Something went wrong updating UI element template');
      } finally {
        patchState(store, setFulfilled());
      }
    },
    updateQuery: (query: UIElementTemplatesStoreState['query']): void => {
      patchState(store, { query });
    },
    getOne: async (id: string): Promise<AppUIElementTemplate> => {
      const allTemplates = untracked(store.entities);
      const existingTemplate = allTemplates.find((tpl) => tpl.id === id);
      if (existingTemplate) {
        return existingTemplate;
      }

      patchState(store, setPending());
      const fetched = await firstValueFrom(uiElementTemplatesAPIService.fetchUIElementTemplate(id));
      patchState(store, setEntity(fetched), setFulfilled());
      return fetched;
    },
  })),
  withHooks({
    onInit: ({ loadAll }) => {
      loadAll();
    },
  })
);
