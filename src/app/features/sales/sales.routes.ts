import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AddComponent } from './pages/sales-add/add.component';
import { SalesListComponent } from './pages/sales-list/sales-list.component';

export const salesRoutes: Routes = [
  { path: '', component: SalesListComponent },
  { path: 'add', component: AddComponent, canActivate: [AuthGuard] },
];
