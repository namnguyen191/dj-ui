import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () => import('../pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'builders',
    loadChildren: () => import('../pages/builders/builders.routes').then((m) => m.buildersRoutes),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
