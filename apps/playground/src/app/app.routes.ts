import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'ui-element-builder',
    loadChildren: () =>
      import('./features/ui-element-builder/lib.routes').then((m) => m.uiElementBuilderRoutes),
  },
  {
    path: 'layout-builder',
    loadChildren: () =>
      import('./features/layout-builder/lib.routes').then((m) => m.layoutBuilderRoutes),
  },
  {
    path: 'idependence-configs-patterns',
    loadChildren: () =>
      import('./features/independence-configs-pattern/lib.routes').then(
        (m) => m.independenceConfigsRoutes
      ),
  },
  { path: '**', redirectTo: 'ui-element-builder', pathMatch: 'full' },
];
