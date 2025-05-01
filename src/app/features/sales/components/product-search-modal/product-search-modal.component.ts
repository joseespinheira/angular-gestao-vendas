import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-search-modal',
  templateUrl: './product-search-modal.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule],
})
export class ProductSearchModalComponent {
  products: any[] = [];
  filteredProducts: any[] = []; // Produtos filtrados
  searchTerm: string = '';

  private productService = inject(ProductService);

  constructor(
    private firestore: Firestore,
    private dialogRef: MatDialogRef<ProductSearchModalComponent>
  ) {
    this.productService.getProducts().subscribe((products) => {
      this.filteredProducts = products.map((product) => {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          stock: product.stock,
          price: product.price,
          category: product.category,
          createdAt: product.createdAt,
          status: product.status,
          userId: product.userId,
        };
      });
      this.products = this.filteredProducts;
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  addProduct(product: any): void {
    this.dialogRef.close(product);
  }
}
