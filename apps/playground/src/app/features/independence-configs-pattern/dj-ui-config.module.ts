import { inject, NgModule } from '@angular/core';
import { CarbonComponentLoader } from '@dj-ui/carbon-ext';
import { provideDJUI, provideDJUICommon, setupDefault } from '@dj-ui/common';
import { COMMON_SETUP_CONFIG, type SetupConfigs } from '@dj-ui/common/shared';
import { ELEMENT_RENDERER_CONFIG, type ElementRendererConfig } from '@dj-ui/core';

import { UiElementTemplateLoadingStateComponent } from './components/ui-element-template-loading-state/ui-element-template-loading-state.component';
import { TemplateFetcherService } from './services/template-fetcher.service';

@NgModule({
  providers: [
    provideDJUI(),
    provideDJUICommon(),
    {
      provide: ELEMENT_RENDERER_CONFIG,
      useFactory: (): ElementRendererConfig => ({
        uiElementLoadingComponent: UiElementTemplateLoadingStateComponent,
      }),
    },
    {
      provide: COMMON_SETUP_CONFIG,
      useFactory: (): SetupConfigs => {
        const templateFetcherService = inject(TemplateFetcherService);

        return {
          templatesHandlers: {
            getUiElementTemplate: (id: string) => templateFetcherService.getUIElementTemplate(id),
            getRemoteResourceTemplate: (id: string) =>
              templateFetcherService.getRemoteResourceTemplate(id),
          },
          componentLoadersMap: CarbonComponentLoader,
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
