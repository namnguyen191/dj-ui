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
    path: 'ui-element/:id',
    loadComponent: () =>
      import('./ui-element/edit-ui-element-template/edit-ui-element-template.component').then(
        (m) => m.EditUIElementTemplateComponent
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'ui-element',
  },
];
