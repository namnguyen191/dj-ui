import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () => import('../pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('@dj-ui/prime-ng-playground/features/builder').then((m) => m.builderRoutes),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
