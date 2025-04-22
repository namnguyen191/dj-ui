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
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';

import type { AppUIElementTemplate, TemplateInfo } from '../app-template';
import {
  type CreateAppUIElementTemplatePayload,
  UIElementTemplateAPIService,
  type UpdateAppUIElementTemplatePayload,
} from '../services/ui-element-template-api.service';

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
  >((uiElementTemplateAPIService = inject(UIElementTemplateAPIService)) => ({
    fetchAll: () => firstValueFrom(uiElementTemplateAPIService.getAllUIElementTemplates()),
    fetch: (id) => firstValueFrom(uiElementTemplateAPIService.fetchUIElementTemplate(id)),
    create: (createPayload) =>
      firstValueFrom(uiElementTemplateAPIService.createUIElementTemplate(createPayload)),
    update: (updatePayload) =>
      firstValueFrom(uiElementTemplateAPIService.updateUIElementTemplate(updatePayload)),
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
    filteredUIElementTemplates: computed<AppUIElementTemplate[]>(
      () => {
        const { id } = query();

        return entities().filter((uiEleTemp) => {
          if (id) {
            return uiEleTemp.id === id;
          }

          return false;
        });
      },
      { equal: isEqual }
    ),
  })),
  withMethods((store, uieTemplatesAPIService = inject(UIElementTemplateAPIService)) => ({
    updateQuery: (query: UIElementTemplatesStoreState['query']): void => {
      patchState(store, { query });
    },
    resetMockTemplates: async (): Promise<void> => {
      await uieTemplatesAPIService.resetExampleTemplates();
      await store.loadAll();
    },
  })),
  withHooks({
    onInit: async ({ loadAll }) => {
      await loadAll();
    },
  })
);
