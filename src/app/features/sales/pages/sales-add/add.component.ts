import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClientService } from '../../../../core/services/client.service';
import { SaleService } from '../../../../core/services/sale.service';
import { ProductSearchModalComponent } from '../../components/product-search-modal/product-search-modal.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddComponent implements OnInit {
  saleForm!: FormGroup;
  clients!: any[]; // Lista de clientes
  products: any[] = []; // Lista de produtos adicionados à venda

  private firestore = inject(Firestore);
  private saleService = inject(SaleService);
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);

  constructor(private fb: FormBuilder, private router: Router) {
    this.saleForm = this.fb.group({
      clientId: ['', Validators.required], // Cliente selecionado
      clientName: ['', Validators.required], // Nome do cliente
      products: [[], Validators.required], // Produtos adicionados
      total: [0, Validators.required], // Total da venda
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
        this.products.push(selectedProduct);
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

  updateTotal(): void {
    const total = this.products.reduce(
      (sum, product) => sum + product.price,
      0
    );
    this.saleForm.patchValue({ total });
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      const saleData = {
        ...this.saleForm.value,
        products: this.products,
      };

      this.saleService.addSale(saleData).then(() => {
        this.router.navigate(['/sales']);
      });

      // const salesCollection = collection(this.firestore, 'sales');
      // addDoc(salesCollection, saleData)
      //   .then(() => {
      //     this.router.navigate(['/sales']);
      //   })
      //   .catch((error) => {
      //     console.error('Erro ao cadastrar a venda:', error);
      //   });
    }
  }

  goBack(): void {
    this.router.navigate(['/sales']);
  }

  navigateToAddClient(): void {
    this.router.navigate(['/clients/add']); // Redireciona para a tela de cadastro de cliente
  }
}
