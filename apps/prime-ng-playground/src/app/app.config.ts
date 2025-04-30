import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  type ApplicationConfig,
  inject,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { CommonComponentLoader, provideDefaultDJUIConfig } from '@dj-ui/common';
import { COMMON_SETUP_CONFIG, type SetupConfigs } from '@dj-ui/common/shared';
import {
  CREATE_JS_RUNNER_WORKER,
  type RemoteResourceTemplate,
  type UIElementTemplate,
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
    provideDefaultDJUIConfig(),
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
        const baseHref = inject(APP_BASE_HREF, { optional: true }) ?? '';
        return {
          templatesHandlers: {
            getUiElementTemplate: (id: string) =>
              httpClient.get<UIElementTemplate>(
                `${baseHref}dj-ui-templates/ui-elements/${id}.json`
              ),
            getRemoteResourceTemplate: (id: string) =>
              httpClient.get<RemoteResourceTemplate>(
                `${baseHref}dj-ui-templates/remote-resources/${id}.json`
              ),
          },
          componentLoadersMap: {
            ...PrimeNgComponentLoader,
            ...CommonComponentLoader,
          },
        };
      },
    },
  ],
};
