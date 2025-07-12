import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { inject, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { CarbonComponentLoader } from '@dj-ui/carbon-ext';
import { COMMON_SETUP_CONFIG, type SetupConfigs } from '@dj-ui/common/shared';
import {
  CREATE_JS_RUNNER_WORKER,
  ELEMENT_RENDERER_CONFIG,
  type ElementRendererConfig,
} from '@dj-ui/core';
import { globalDelayInterceptorFactory } from '@namnguyen191/common-angular-helper';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { from } from 'rxjs';

import { appRoutes } from './app.routes';
import { DuiUiElementLoadingComponent } from './components/dui-ui-element-loading/dui-ui-element-loading.component';
import { RemoteResourceTemplatesAPIService } from './services/remote-resource-templates-api.service';
import { RemoteResourceTemplatesLocalAPIService } from './services/remote-resource-templates-local-api.service';
import { UIElementTemplatesAPIService } from './services/ui-element-templates-api.service';
import { UIElementTemplatesLocalAPIService } from './services/ui-element-templates-local-api.service';
import { RemoteResourceTemplatesStore } from './state-store/remoteResourceTemplates.store';
import { UIElementTemplatesStore } from './state-store/uiElementTemplates.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMonacoEditor(),
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideHttpClient(withFetch(), withInterceptors([globalDelayInterceptorFactory(100)])),
    provideAnimationsAsync(),
    {
      provide: CREATE_JS_RUNNER_WORKER,
      useValue: (): Worker => {
        const worker = new Worker(new URL('./js-runner.worker', import.meta.url), {
          name: 'CustomWorker',
          type: 'module',
        });
        return worker;
      },
    },
    {
      provide: ELEMENT_RENDERER_CONFIG,
      useFactory: (): ElementRendererConfig => {
        return {
          uiElementLoadingComponent: DuiUiElementLoadingComponent,
        };
      },
    },
    {
      provide: COMMON_SETUP_CONFIG,
      useFactory: (): SetupConfigs => {
        const uiElementTemplatesStore = inject(UIElementTemplatesStore);
        const remoteResourceTemplatesStore = inject(RemoteResourceTemplatesStore);

        return {
          templatesHandlers: {
            getUiElementTemplate: (id: string) => from(uiElementTemplatesStore.get(id)),
            getRemoteResourceTemplate: (id: string) => from(remoteResourceTemplatesStore.get(id)),
          },
          componentLoadersMap: CarbonComponentLoader,
        };
      },
    },
    {
      provide: UIElementTemplatesAPIService,
      useFactory: (): UIElementTemplatesAPIService => {
        if (ENABLE_LOCAL_API) {
          return new UIElementTemplatesLocalAPIService();
        } else {
          return new UIElementTemplatesAPIService();
        }
      },
    },
    {
      provide: RemoteResourceTemplatesAPIService,
      useFactory: (): RemoteResourceTemplatesAPIService => {
        if (ENABLE_LOCAL_API) {
          return new RemoteResourceTemplatesLocalAPIService();
        } else {
          return new RemoteResourceTemplatesAPIService();
        }
      },
    },
  ],
};
