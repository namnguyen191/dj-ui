/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { computed, inject } from '@angular/core';
import { SimpleGridLayoutElementType } from '@dj-ui/common/shared';
import { type UIElementTemplate, UIElementTemplateService } from '@dj-ui/core';
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
    isLayout?: boolean;
  };
};
const uiElementTemplatesStoreInitialState: UIElementTemplatesStoreState = {
  query: {},
};

export const layoutUIElement = new Set([SimpleGridLayoutElementType]);

export type UIElementTemplateInfo = TemplateInfo & Pick<UIElementTemplate, 'type'>;

export const UIElementTemplatesStore = signalStore(
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
    delete: (id) => firstValueFrom(uiElementTemplateAPIService.deleteUIElementTemplate(id)),
  })),
  withComputed(({ entities, query }) => ({
    allUIElementTemplatesInfo: computed<UIElementTemplateInfo[]>(() => {
      return entities().map(({ id, createdAt, updatedAt, name, description, type }) => ({
        id,
        type,
        createdAt,
        updatedAt,
        name,
        description,
      }));
    }),
    filteredUIElementTemplates: computed<AppUIElementTemplate[]>(
      () => {
        const { id, isLayout = false } = query();

        return entities().filter((uiEleTemp) => {
          let matched = true;

          if (id) {
            matched = uiEleTemp.id === id;
          }

          if (isLayout) {
            matched = matched && layoutUIElement.has(uiEleTemp.type);
          }

          return matched;
        });
      },
      { equal: isEqual }
    ),
  })),
  withMethods(
    (
      store,
      uieTemplatesAPIService = inject(UIElementTemplateAPIService),
      uiElementTemplateService = inject(UIElementTemplateService)
    ) => ({
      updateQuery: (query: UIElementTemplatesStoreState['query']): void => {
        patchState(store, { query });
      },
      resetMockTemplates: async (): Promise<void> => {
        await uieTemplatesAPIService.resetExampleTemplates();
        await store.loadAll();
        uiElementTemplateService.clearAllTemplates();
      },
    })
  ),
  withHooks({
    onInit: ({ loadAll }) => {
      void loadAll();
    },
  })
);

export type FilterQuery = {
  id?: string;
  isLayout?: boolean;
};
export const filterTemplatesByQuery = ({
  id,
  isLayout,
}: FilterQuery): ((uiEleTemp: AppUIElementTemplate) => boolean) => {
  return (uiEleTemp: AppUIElementTemplate): boolean => {
    let matched = true;

    if (id) {
      matched = uiEleTemp.id === id;
    }

    if (isLayout) {
      matched = matched && layoutUIElement.has(uiEleTemp.type);
    } else {
      matched = matched && !layoutUIElement.has(uiEleTemp.type);
    }

    return matched;
  };
};
