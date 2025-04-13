import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login/register', pathMatch: 'full' },
  { path: 'login', 
    loadChildren: () => import('./features/auth/auths.routes').then(m => m.authsRoutes) },
  { path: 'sales', 
    loadChildren: () => import('./features/sales/sales.routes').then(m => m.salesRoutes) },
  { path: '**', redirectTo: 'login' }
];