/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import type {
  CreateAppUIElementTemplatePayload,
  UpdateAppUIElementTemplatePayload,
} from '../services/ui-element-templates-api.service';
import { UIElementTemplatesAPIService } from '../services/ui-element-templates-api.service';
import type { AppUIElementTemplate, TemplateInfo } from '../shared/dj-ui-app-template';
import { withEntitiesAndLoaders } from './entities-and-loaders.store-feat';

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
  withEntitiesAndLoaders<
    AppUIElementTemplate,
    CreateAppUIElementTemplatePayload,
    UpdateAppUIElementTemplatePayload
  >((uiElementTemplatesAPIService = inject(UIElementTemplatesAPIService)) => ({
    fetchAll: () => firstValueFrom(uiElementTemplatesAPIService.getAllUIElementTemplates()),
    fetch: (id) => firstValueFrom(uiElementTemplatesAPIService.fetchUIElementTemplate(id)),
    create: (createPayload) =>
      firstValueFrom(uiElementTemplatesAPIService.createUIElementTemplate(createPayload)),
    update: (updatePayload) =>
      firstValueFrom(uiElementTemplatesAPIService.updateUIElementTemplate(updatePayload)),
  })),
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
  withMethods((store) => ({
    updateQuery: (query: UIElementTemplatesStoreState['query']): void => {
      patchState(store, { query });
    },
  })),
  withHooks({
    onInit: ({ loadAll }) => {
      void loadAll();
    },
  })
);
