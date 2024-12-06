import { InjectionToken, Type } from '@angular/core';

export const INTERPOLATION_REGEX = /^(<\${)(.*)(}\$>)$/;

export type CoreConfig = {
  layoutLoadingComponent?: Type<unknown>;
  uiElementLoadingComponent?: Type<unknown>;
};
export const CORE_CONFIG = new InjectionToken<CoreConfig>('CORE_CONFIG');
export const CREATE_JS_RUNNER_WORKER = new InjectionToken<() => Worker>('CREATE_JS_RUNNER_WORKER');
