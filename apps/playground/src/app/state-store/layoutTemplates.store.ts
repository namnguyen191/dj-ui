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
  CreateAppLayoutTemplatePayload,
  UpdateAppLayoutTemplatePayload,
} from '../services/layout-templates-api.service';
import { LayoutTemplatesAPIService } from '../services/layout-templates-api.service';
import type { AppLayoutTemplate, TemplateInfo } from '../shared/dj-ui-app-template';
import { withEntitiesAndLoaders } from './entities-and-loaders.store-feat';

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
  withEntitiesAndLoaders<
    AppLayoutTemplate,
    CreateAppLayoutTemplatePayload,
    UpdateAppLayoutTemplatePayload
  >((layoutTemplatesAPIService = inject(LayoutTemplatesAPIService)) => ({
    fetchAll: () => firstValueFrom(layoutTemplatesAPIService.getAllLayoutTemplates()),
    fetch: (id) => firstValueFrom(layoutTemplatesAPIService.fetchLayoutTemplate(id)),
    create: (createPayload) =>
      firstValueFrom(layoutTemplatesAPIService.createLayoutTemplate(createPayload)),
    update: (updatePayload) =>
      firstValueFrom(layoutTemplatesAPIService.updateLayoutTemplate(updatePayload)),
  })),
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
  withMethods((store) => ({
    updateQuery: (query: LayoutTemplatesStoreState['query']): void => {
      patchState(store, { query });
    },
  })),
  withHooks({
    onInit: ({ loadAll }) => {
      loadAll();
    },
  })
);
