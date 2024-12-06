import { inject, NgModule } from '@angular/core';
import { CarbonComponentLoader } from '@dj-ui/carbon-ext';
import { COMMON_SETUP_CONFIG, provideDJUI, SetupConfigs, setupDefault } from '@dj-ui/common';
import { CORE_CONFIG, DjuiComponent } from '@dj-ui/core';

import { LayoutTemplateLoadingStateComponent } from './components/layout-template-loading-state/layout-template-loading-state.component';
import { UiElementTemplateLoadingStateComponent } from './components/ui-element-template-loading-state/ui-element-template-loading-state.component';
import { TemplateFetcherService } from './services/template-fetcher.service';

@NgModule({
  imports: [DjuiComponent],
  exports: [DjuiComponent],
  providers: [
    provideDJUI(),
    {
      provide: CORE_CONFIG,
      useValue: {
        layoutLoadingComponent: LayoutTemplateLoadingStateComponent,
        uiElementLoadingComponent: UiElementTemplateLoadingStateComponent,
      },
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
