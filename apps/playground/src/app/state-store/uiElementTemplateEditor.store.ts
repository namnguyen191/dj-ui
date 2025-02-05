import { computed, inject } from '@angular/core';
import { LayoutTemplate, LayoutTemplateService, UIElementTemplateService } from '@dj-ui/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CompactType } from 'angular-gridster2';
import { immerPatchState } from 'ngrx-immer/signals';

import {
  AppUIElementTemplate,
  AppUIElementTemplateEditableFields,
  AppUIElementTemplateUnEditableFields,
} from '../shared/dj-ui-app-template';

const PREVIEW_UI_ELEMENT_TEMPLATE_ID = 'UI_ELEMENT_TEMPLATE_FOR_PREVIEW_ONLY';

export const PREVIEW_LAYOUT_BASE_CONFIG: LayoutTemplate = {
  id: 'preview-layout',
  gridConfigs: {
    compactType: CompactType.None,
  },
  uiElementInstances: [],
};

type UIElementTemplateEditorState = {
  currentEditingTemplate: AppUIElementTemplate | null;
};
const uiElementTemplateStoreInitialState: UIElementTemplateEditorState = {
  currentEditingTemplate: null,
};

export const UIElementTemplateEditorStore = signalStore(
  { providedIn: 'root' },
  withState(uiElementTemplateStoreInitialState),
  withComputed(({ currentEditingTemplate }) => ({
    currentEditableFields: computed<AppUIElementTemplateEditableFields | null>(() => {
      const template = currentEditingTemplate();
      if (!template) {
        return null;
      }
      const { id, createdAt, updatedAt, ...editableFields } = template;
      return editableFields;
    }),
    currentUnEditableFields: computed<AppUIElementTemplateUnEditableFields | null>(() => {
      const template = currentEditingTemplate();
      if (!template) {
        return null;
      }
      const { id, createdAt, updatedAt } = template;
      return {
        id,
        createdAt,
        updatedAt,
      };
    }),
  })),
  withMethods(
    (
      store,
      uiElementTemplateService = inject(UIElementTemplateService),
      layoutTemplateService = inject(LayoutTemplateService)
    ) => ({
      setCurrentEditingTemplate: (currentEditingTemplate: AppUIElementTemplate): void => {
        uiElementTemplateService.updateOrRegisterTemplate({
          ...currentEditingTemplate,
          id: PREVIEW_UI_ELEMENT_TEMPLATE_ID,
        });
        layoutTemplateService.updateTemplate({
          ...PREVIEW_LAYOUT_BASE_CONFIG,
          uiElementInstances: [
            {
              id: 'instance-1',
              uiElementTemplateId: PREVIEW_UI_ELEMENT_TEMPLATE_ID,
            },
          ],
        });
        patchState(store, { currentEditingTemplate });
      },
      updateCurrentEditingTemplate: (updates: AppUIElementTemplateEditableFields): void => {
        uiElementTemplateService.updateTemplate({
          ...updates,
          id: PREVIEW_UI_ELEMENT_TEMPLATE_ID,
        });
        immerPatchState(store, (state) => {
          if (!state.currentEditingTemplate) {
            return;
          }
          state.currentEditingTemplate = {
            ...state.currentEditingTemplate,
            ...updates,
          };
        });
      },
      initPreviewLayout: (): void => {
        layoutTemplateService.registerTemplate(PREVIEW_LAYOUT_BASE_CONFIG);
      },
    })
  ),
  withHooks({
    onInit: ({ initPreviewLayout }) => {
      initPreviewLayout();
    },
  })
);
