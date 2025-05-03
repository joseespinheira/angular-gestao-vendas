import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from '@core/models/productDTO';
import { ClientService } from '@core/services/client.service';
import { HeaderService } from '@core/services/header.service';
import { SaleService } from '@core/services/sale.service';
import { ProductSearchModalComponent } from '../../components/product-search-modal/product-search-modal.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddComponent implements OnInit {
  saleForm!: FormGroup;
  clients!: any[];
  products: Product[] = [];

  private saleService = inject(SaleService);
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);
  private headerService = inject(HeaderService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.saleForm = this.fb.group({
      clientId: ['', Validators.required],
      clientName: ['', Validators.required],
      products: [[], Validators.required],
      total: [0, Validators.required],
      createdAt: [Date.now()],
      status: ['Pendente'],
    });

    this.clientService.getClients().subscribe((clients) => {
      this.clients = clients.map((client) => {
        return {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
        };
      });
    });
  }

  ngOnInit(): void {}

  openProductSearchModal(): void {
    const dialogRef = this.dialog.open(ProductSearchModalComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((selectedProduct) => {
      if (selectedProduct) {
        const existingProduct = this.products.find(
          (product) => product.id === selectedProduct.id
        );

        if (existingProduct) {
          // Incrementa a quantidade se o produto já existir
          existingProduct.stock += 1;
        } else {
          // Adiciona o produto com quantidade inicial
          this.products.push({ ...selectedProduct, stock: 1 });
        }

        this.saleForm.patchValue({ products: this.products });
        this.updateTotal();
      }
    });
  }

  onClientChange(event: Event): void {
    const selectedClientId = (event.target as HTMLSelectElement).value;
    const selectedClient = this.clients.find(
      (client) => client.id === selectedClientId
    );

    if (selectedClient) {
      this.saleForm.patchValue({ clientName: selectedClient.name });
    }
  }

  increaseStock(index: number): void {
    this.products[index].stock += 1;
    this.updateTotal();
  }

  decreaseStock(index: number): void {
    if (this.products[index].stock > 1) {
      this.products[index].stock -= 1;
    } else {
      this.products.splice(index, 1);
    }
    this.updateTotal();
  }

  updateTotal(): void {
    const total = this.products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );
    this.saleForm.patchValue({ total });
    if (this.products.length === 0) {
      this.saleForm.get('total')?.setErrors({ required: true });
      return;
    }
  }

  onSubmit(): void {
    if (this.products.length === 0) {
      this.saleForm.get('total')?.setErrors({ required: true });
      return;
    }

    if (this.saleForm.valid) {
      const saleData = {
        ...this.saleForm.value,
        products: this.products,
      };

      this.saleService
        .addSale(saleData)
        .then(() => {
          this.router.navigate(['/sales']);
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }

  goBack(): void {
    this.router.navigate([this.headerService.getPreviousPage()]);
  }

  navigateToAddClient(): void {
    this.router.navigate(['/clients/add']); // Redireciona para a tela de cadastro de cliente
  }
}
