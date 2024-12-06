import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'builder-patterns',
    loadChildren: () =>
      import('./features/builder-patterns/lib.routes').then((m) => m.builderRoutes),
  },
  {
    path: 'idependence-configs-patterns',
    loadChildren: () =>
      import('./features/independence-configs-pattern/lib.routes').then(
        (m) => m.independenceConfigsRoutes
      ),
  },
  { path: '**', redirectTo: 'builder-patterns', pathMatch: 'full' },
];
