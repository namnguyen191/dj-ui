import type { Route } from '@angular/router';

export const layoutBuilderRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/layouts-list-page/layouts-list-page.component').then(
        (m) => m.LayoutsListPageComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/new-layout-page/new-layout-page.component').then(
        (m) => m.NewLayoutPageComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/edit-layout-page/edit-layout-page.component').then(
        (m) => m.EditLayoutPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
