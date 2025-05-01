import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auths.routes').then((m) => m.authsRoutes),
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('./features/sales/sales.routes').then((m) => m.salesRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then(
        (m) => m.productsRoutes
      ),
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./features/clients/clients.routes').then((m) => m.clientsRoutes),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  { path: '**', redirectTo: 'login' },
];
