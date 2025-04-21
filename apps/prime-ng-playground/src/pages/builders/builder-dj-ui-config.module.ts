import { inject, NgModule } from '@angular/core';
import {
  COMMON_SETUP_CONFIG,
  provideDJUI,
  provideDJUICommon,
  type SetupConfigs,
  setupDefault,
} from '@dj-ui/common';
import { PrimeNgComponentLoader } from '@dj-ui/prime-ng-ext';
import { from } from 'rxjs';

import { RemoteResourceTemplatesStore } from '../../state-stores/remoteResourceTemplates.store';
import { UIElementTemplatesStore } from '../../state-stores/uiElementTemplates.store';

@NgModule({
  providers: [
    provideDJUI(),
    provideDJUICommon(),
    {
      provide: COMMON_SETUP_CONFIG,
      useFactory: (): SetupConfigs => {
        const uielementTemplatesStore = inject(UIElementTemplatesStore);
        const remoteResourceTemplatesStore = inject(RemoteResourceTemplatesStore);

        return {
          templatesHandlers: {
            // getLayoutTemplate: (id: string) => null as any,
            getUiElementTemplate: (id: string) => from(uielementTemplatesStore.get(id)),
            getRemoteResourceTemplate: (id: string) => from(remoteResourceTemplatesStore.get(id)),
          },
          componentLoadersMap: PrimeNgComponentLoader,
        };
      },
    },
  ],
})
export class BuilderDJUIConfigModule {
  constructor() {
    setupDefault();
  }
}
