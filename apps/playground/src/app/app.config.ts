import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { CarbonComponentLoader } from '@dj-ui/carbon-ext';
import { COMMON_SETUP_CONFIG, SetupConfigs } from '@dj-ui/common';
import { CORE_LAYOUT_CONFIG, CoreLayoutConfig, CREATE_JS_RUNNER_WORKER } from '@dj-ui/core';
import { globalDelayInterceptorFactory } from '@namnguyen191/common-angular-helper';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { from } from 'rxjs';

import { appRoutes } from './app.routes';
import { DuiLayoutLoadingComponent } from './components/dui-layout-loading/dui-layout-loading.component';
import { DuiUIElementBuilderContextMenuWrapperComponent } from './components/dui-ui-element-builder-context-menu-wrapper/dui-ui-element-builder-context-menu-wrapper.component';
import { DuiUiElementLoadingComponent } from './components/dui-ui-element-loading/dui-ui-element-loading.component';
import { LayoutTemplatesStore } from './state-store/layoutTemplates.store';
import { RemoteResourceTemplatesStore } from './state-store/remoteResourceTemplates.store';
import { UIElementTemplatesStore } from './state-store/uiElementTemplates.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMonacoEditor(),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideHttpClient(withInterceptors([globalDelayInterceptorFactory(100)])),
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
      provide: CORE_LAYOUT_CONFIG,
      useFactory: (): CoreLayoutConfig => {
        return {
          layoutLoadingComponent: DuiLayoutLoadingComponent,
          uiElementLoadingComponent: DuiUiElementLoadingComponent,
          uiElementExtraWrapperComponent: DuiUIElementBuilderContextMenuWrapperComponent,
        };
      },
    },
    {
      provide: COMMON_SETUP_CONFIG,
      useFactory: (): SetupConfigs => {
        const uiElementTemplatesStore = inject(UIElementTemplatesStore);
        const layoutTemplatesStore = inject(LayoutTemplatesStore);
        const remoteResourceTemplatesStore = inject(RemoteResourceTemplatesStore);

        return {
          templatesHandlers: {
            getLayoutTemplate: (id: string) => from(layoutTemplatesStore.get(id)),
            getUiElementTemplate: (id: string) => from(uiElementTemplatesStore.get(id)),
            getRemoteResourceTemplate: (id: string) => from(remoteResourceTemplatesStore.get(id)),
          },
          componentLoadersMap: CarbonComponentLoader,
        };
      },
    },
  ],
};
