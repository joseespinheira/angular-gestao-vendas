import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'sales', loadChildren: () => import('./features/sales/sales.routes').then(m => m.salesRoutes) },
  { path: '**', redirectTo: 'login' }
];