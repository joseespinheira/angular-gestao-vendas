import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AddComponent } from './pages/add/add.component';
import { ClientsListComponent } from './pages/list/list.component';

export const clientsRoutes: Routes = [
  { path: '', component: ClientsListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddComponent, canActivate: [AuthGuard] },
];
