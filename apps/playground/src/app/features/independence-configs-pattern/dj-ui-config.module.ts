import { inject, NgModule } from '@angular/core';
import { CarbonComponentLoader } from '@dj-ui/carbon-ext';
import {
  COMMON_SETUP_CONFIG,
  provideDJUI,
  provideDJUICommon,
  type SetupConfigs,
  setupDefault,
} from '@dj-ui/common';
import { CORE_LAYOUT_CONFIG, type CoreLayoutConfig } from '@dj-ui/core';

import { LayoutTemplateLoadingStateComponent } from './components/layout-template-loading-state/layout-template-loading-state.component';
import { UiElementTemplateLoadingStateComponent } from './components/ui-element-template-loading-state/ui-element-template-loading-state.component';
import { TemplateFetcherService } from './services/template-fetcher.service';

@NgModule({
  providers: [
    provideDJUI(),
    provideDJUICommon(),
    {
      provide: CORE_LAYOUT_CONFIG,
      useFactory: (): CoreLayoutConfig => ({
        uiElementLoadingComponent: UiElementTemplateLoadingStateComponent,
      }),
    },
    {
      provide: COMMON_SETUP_CONFIG,
      useFactory: (): SetupConfigs => {
        const templateFetcherService = inject(TemplateFetcherService);

        return {
          templatesHandlers: {
            getLayoutTemplate: (id: string) => templateFetcherService.getLayoutTemplate(id),
            getUiElementTemplate: (id: string) => templateFetcherService.getUIElementTemplate(id),
            getRemoteResourceTemplate: (id: string) =>
              templateFetcherService.getRemoteResourceTemplate(id),
          },
          componentLoadersMap: CarbonComponentLoader,
          layoutLoadingComponent: LayoutTemplateLoadingStateComponent,
        };
      },
    },
  ],
})
export class DJUIConfigModule {
  constructor() {
    setupDefault();
  }
}
