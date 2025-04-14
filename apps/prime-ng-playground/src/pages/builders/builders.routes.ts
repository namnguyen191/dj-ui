import type { Route } from '@angular/router';

export const buildersRoutes: Route[] = [
  {
    path: 'ui-element',
    loadComponent: () =>
      import('./ui-element/ui-element-list/ui-element-list.component').then(
        (m) => m.UIElementListComponent
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'ui-element',
  },
];
