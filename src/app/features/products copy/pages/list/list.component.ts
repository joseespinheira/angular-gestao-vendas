import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [CommonModule],
})
export class ProductsListComponent implements OnInit {
  private router = inject(Router);
  products = [
    { id: 1, client: 'Cliente A', total: 150.0, date: '2025-04-13' },
    { id: 2, client: 'Cliente B', total: 200.0, date: '2025-04-12' },
    { id: 3, client: 'Cliente C', total: 300.0, date: '2025-04-11' },
  ];

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // firestore = inject(Firestore);
  // itemCollection = collection(this.firestore, 'items');
  // item$ = collectionData<any>(this.itemCollection);

  ngOnInit(): void {
    // this.item$.subscribe((data) => {
    //   this.products = data;
    // });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
