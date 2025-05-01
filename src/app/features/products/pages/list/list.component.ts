import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Product } from '@core/models/productDTO';
import { ProductService } from '@core/services/product.service';
import { ScreenService } from '@core/services/screen.service';
import { PageBaseComponent } from '@shared/components/page-base/page-base.component';
import { EditStockModalComponent } from '../../components/edit-stock-modal/edit-stock-modal.component';

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
  private dialog = inject(MatDialog);

  products: Product[] = [];
  maxCharacters$ = this.screenService.maxCharacters$;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.products = [];
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map((item) => {
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
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.router.navigate(['/login']); // Redireciona para login se não autenticado
      },
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
      this.getProducts();
      return;
    });
  }

  editStock(product: Product): void {
    const dialogRef = this.dialog.open(EditStockModalComponent, {
      width: '400px',
      data: { product },
    });

    dialogRef.afterClosed().subscribe((newStock) => {
      if (newStock !== undefined) {
        product.stock = newStock; // Atualiza o estoque localmente
        this.productService
          .updateProductStock(product.id, newStock)
          .then(() => {
            console.log('Estoque atualizado com sucesso!');
          });
      }
    });
  }
}
