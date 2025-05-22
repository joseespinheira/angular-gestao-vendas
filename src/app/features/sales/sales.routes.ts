import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { AddComponent } from './pages/sales-add/add.component';
import { SalesDetailsComponent } from './pages/sales-details/details.component';
import { SalesListComponent } from './pages/sales-list/sales-list.component';
import { SalesPayComponent } from './pages/sales-pay/sales-pay.component';

export const salesRoutes: Routes = [
  { path: '', component: SalesListComponent },
  { path: 'add', component: AddComponent, canActivate: [AuthGuard] },
  { path: 'pay', component: SalesPayComponent, canActivate: [AuthGuard] },
  {
    path: 'details/:id',
    component: SalesDetailsComponent,
    canActivate: [AuthGuard],
  },
];
