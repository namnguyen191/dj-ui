import { Route } from '@angular/router';

export const independenceConfigsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./djui-with-different-configs/djui-with-different-configs.component').then(
        (m) => m.DjuiWithDifferentConfigsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
