import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'],
  imports: [CommonModule],
})
export class SalesListComponent implements OnInit {
  private router = inject(Router);
  sales = [
    { id: 1, client: 'Cliente A', total: 150.0, date: '2025-04-13' },
    { id: 2, client: 'Cliente B', total: 200.0, date: '2025-04-12' },
    { id: 3, client: 'Cliente C', total: 300.0, date: '2025-04-11' }
  ];

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // firestore = inject(Firestore);
  // itemCollection = collection(this.firestore, 'items');
  // item$ = collectionData<any>(this.itemCollection);
  
  ngOnInit(): void {
    // this.item$.subscribe((data) => {
    //   this.sales = data;
    // });
  }
}