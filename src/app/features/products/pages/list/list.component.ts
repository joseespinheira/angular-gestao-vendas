import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenService } from '@core/services/screen.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [CommonModule],
})
export class ProductsListComponent implements OnInit {
  private router = inject(Router);
  private screenService = inject(ScreenService);

  products = [
    {
      id: 1,
      client: 'Produto com nome grande',
      total: 150.0,
      date: '2025-04-13',
    },
    { id: 2, client: 'Produto', total: 200.0, date: '2025-04-12' },
    {
      id: 3,
      client: 'Aqui é quase um texto de tanta coisa escrita',
      total: 300.0,
      date: '2025-04-11',
    },
  ];
  maxCharacters = 10; // Número inicial de caracteres
  maxCharacters$ = this.screenService.maxCharacters$; // Observable para o número de caracteres

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  // firestore = inject(Firestore);
  // itemCollection = collection(this.firestore, 'items');
  // item$ = collectionData<any>(this.itemCollection);

  ngOnInit(): void {
    // this.item$.subscribe((data) => {
    //   this.products = data;
    // });
  }

  showDetails(product: any): void {
    alert(`Detalhes do Produto:\n${JSON.stringify(product, null, 2)}`);
  }
}
