import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { immerPatchState } from 'ngrx-immer/signals';

import {
  AppLayoutTemplate,
  AppLayoutTemplateEditableFields,
  AppLayoutTemplateUnEditableFields,
} from '../shared/dj-ui-app-template';

type LayoutTemplateEditorState = {
  currentEditingTemplate: AppLayoutTemplate | null;
};
const layoutTemplateStoreInitialState: LayoutTemplateEditorState = {
  currentEditingTemplate: null,
};

export const LayoutTemplateEditorStore = signalStore(
  { providedIn: 'root' },
  withState(layoutTemplateStoreInitialState),
  withComputed(({ currentEditingTemplate }) => ({
    currentEditableFields: computed<AppLayoutTemplateEditableFields | null>(() => {
      const template = currentEditingTemplate();
      if (!template) {
        return null;
      }
      const { id, createdAt, updatedAt, ...editableFields } = template;
      return editableFields;
    }),
    currentUnEditableFields: computed<AppLayoutTemplateUnEditableFields | null>(() => {
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
  withMethods((store) => ({
    setCurrentEditingTemplate: (currentEditingTemplate: AppLayoutTemplate): void => {
      patchState(store, { currentEditingTemplate });
    },
    updateCurrentEditingTemplate: (updates: AppLayoutTemplateEditableFields): void => {
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
  }))
);
