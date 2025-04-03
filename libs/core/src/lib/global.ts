import { InjectionToken } from '@angular/core';

export const INTERPOLATION_REGEX = /^(<\${)([\s\S]*?)(}\$>)$/;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CoreConfig = {};
export const CORE_CONFIG = new InjectionToken<CoreConfig>('CORE_CONFIG');
export const CREATE_JS_RUNNER_WORKER = new InjectionToken<() => Worker>('CREATE_JS_RUNNER_WORKER');
export const MAX_WORKER_POOl = new InjectionToken<number>('MAX_WORKER_POOl');
