import { inject, untracked } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  RemoteResourceTemplatesStore,
  UIElementTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';

export const isAlphaNumericValidator = (): ValidatorFn => {
  const regex = /^[a-zA-Z0-9]*$/;

  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value;
    if (value && !regex.test(value)) {
      return { isAlphaNumeric: true };
    }
    return null;
  };
};

export const isUIETemplateIdUniqueValidator = (): ValidatorFn => {
  const uiElementTemplatesStore = inject(UIElementTemplatesStore);

  return (control: AbstractControl<string>): ValidationErrors | null => {
    const allTemplates = untracked(uiElementTemplatesStore.allUIElementTemplatesInfo);

    const matched = allTemplates.find((template) => template.id === control.value);

    return matched ? { idNotUnique: true } : null;
  };
};

export const isRRTemplateIdUniqueValidator = (): ValidatorFn => {
  const remoteResourceTemplatesStore = inject(RemoteResourceTemplatesStore);

  return (control: AbstractControl<string>): ValidationErrors | null => {
    const allTemplates = untracked(remoteResourceTemplatesStore.allRemoteResourceTemplatesInfo);

    const matched = allTemplates.find((template) => template.id === control.value);

    return matched ? { idNotUnique: true } : null;
  };
};
