import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AddComponent } from './pages/add/add.component';
import { ProductsListComponent } from './pages/list/list.component';

export const productsRoutes: Routes = [
  { path: '', component: ProductsListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddComponent, canActivate: [AuthGuard] },
];
