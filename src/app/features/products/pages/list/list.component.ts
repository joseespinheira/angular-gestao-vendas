import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Product } from '@core/models/productDTO';
import { ProductService } from '@core/services/product.service';
import { ScreenService } from '@core/services/screen.service';
import { PageBaseComponent } from '@shared/components/page-base/page-base.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
})
export class ProductsListComponent extends PageBaseComponent implements OnInit {
  private router = inject(Router);
  private screenService = inject(ScreenService);
  private productService = inject(ProductService);

  products: Product[] = [];
  maxCharacters$ = this.screenService.maxCharacters$;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    // chamada a um serviço para obter produtos
    this.productService.getProducts().subscribe((data) => {
      console.log('Produtos:', data);
      this.products = data.map((item) => {
        console.log('Item:', item);
        // return {
        //   ...item,
        //   //createdAt: item['createdAt'].toDate().toLocaleDateString('pt-BR'),
        // };
        return new Product({
          id: item['id'],
          name: item['name'],
          description: item['description'],
          stock: item['stock'],
          price: item['price'],
          category: item['category'],
          createdAt: item['createdAt'],
          status: item['status'],
          userId: item['userId'],
        });
      });
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  showDetails(product: any): void {
    alert(`Detalhes do Produto:\n${JSON.stringify(product, null, 2)}`);
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).then(() => {
      console.log('Produto excluído com sucesso!');
      this.getProducts();
    });
  }
}
