import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { COMMON_SETUP_CONFIG, SetupConfigs } from '@dj-ui/common';
import {
  CREATE_JS_RUNNER_WORKER,
  LayoutTemplate,
  RemoteResourceTemplate,
  UIElementTemplate,
} from '@dj-ui/core';
import { PrimeNgComponentLoader } from '@dj-ui/prime-ng-ext';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideHttpClient(),
    {
      provide: CREATE_JS_RUNNER_WORKER,
      useValue: (): Worker => {
        const worker = new Worker(new URL('../js-runner.worker', import.meta.url), {
          name: 'CustomWorker',
          type: 'module',
        });
        return worker;
      },
    },
    {
      provide: COMMON_SETUP_CONFIG,
      useFactory: (): SetupConfigs => {
        const httpClient = inject(HttpClient);
        return {
          templatesHandlers: {
            getLayoutTemplate: (id: string) =>
              httpClient.get<LayoutTemplate>(`/dj-ui/layouts/${id}.json`),
            getUiElementTemplate: (id: string) =>
              httpClient.get<UIElementTemplate>(`/dj-ui/ui-elements/${id}.json`),
            getRemoteResourceTemplate: (id: string) =>
              httpClient.get<RemoteResourceTemplate>(`/dj-ui/remote-resources/${id}.json`),
          },
          componentLoadersMap: PrimeNgComponentLoader,
        };
      },
    },
  ],
};
