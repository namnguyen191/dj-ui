import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  type Provider,
} from '@angular/core';
import type { Route } from '@angular/router';
import { provideDJUI, provideDJUICommon } from '@dj-ui/common';
import { COMMON_SETUP_CONFIG, type SetupConfigs } from '@dj-ui/common/shared';
import { PrimeNgComponentLoader } from '@dj-ui/prime-ng-ext';
import {
  RemoteResourceTemplatesStore,
  UIElementTemplatesStore,
} from '@dj-ui/prime-ng-playground/shared';
import { from } from 'rxjs';

import { BuilderComponent } from './builder.component';

const provideDJUIBuilder = (): EnvironmentProviders => {
  const providers: Provider[] = [
    [
      provideDJUI(),
      provideDJUICommon(),
      {
        provide: COMMON_SETUP_CONFIG,
        useFactory: (): SetupConfigs => {
          const uielementTemplatesStore = inject(UIElementTemplatesStore);
          const remoteResourceTemplatesStore = inject(RemoteResourceTemplatesStore);

          return {
            templatesHandlers: {
              getUiElementTemplate: (id: string) => from(uielementTemplatesStore.get(id)),
              getRemoteResourceTemplate: (id: string) => from(remoteResourceTemplatesStore.get(id)),
            },
            componentLoadersMap: PrimeNgComponentLoader,
          };
        },
      },
    ],
  ];

  return makeEnvironmentProviders(providers);
};

export const builderRoutes: Route[] = [
  {
    path: '',
    component: BuilderComponent,
    providers: [provideDJUIBuilder()],
    children: [
      {
        path: 'ui-element',
        loadComponent: () =>
          import('./ui-element/ui-element-list/ui-element-list.component').then(
            (m) => m.UIElementListComponent
          ),
      },
      {
        path: 'ui-element/:id',
        loadComponent: () =>
          import('./ui-element/edit-ui-element-template/edit-ui-element-template.component').then(
            (m) => m.EditUIElementTemplateComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'ui-element',
        pathMatch: 'full',
      },
    ],
  },
];
