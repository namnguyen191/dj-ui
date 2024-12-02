import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'builder-patterns',
    loadChildren: () =>
      import('./features/builder-patterns/lib.routes').then((m) => m.builderRoutes),
  },
  { path: '**', redirectTo: 'builder-patterns', pathMatch: 'full' },
];
