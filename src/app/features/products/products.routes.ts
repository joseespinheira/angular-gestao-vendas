import { Routes } from '@angular/router';
import { AddComponent } from './pages/add/add.component';
import { ProductsListComponent } from './pages/list/list.component';

export const productsRoutes: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'add', component: AddComponent },
];
