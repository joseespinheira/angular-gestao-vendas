import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Sale } from '@core/models/saleDTO';
import { SaleService } from '@core/services/sale.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'],
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
})
export class SalesListComponent implements OnInit {
  private router = inject(Router);
  private saleService = inject(SaleService);
  sales: Sale[] = [];

  ngOnInit(): void {
    this.getSales();
  }

  navigateTo(value: string) {
    this.router.navigate([value]);
  }

  getSales() {
    setTimeout(() => {
      this.saleService
        .getSales()
        .pipe(take(1))
        .subscribe((sales) => {
          this.sales = sales.map((sale) => {
            return new Sale({
              id: sale['id'],
              clientId: sale['clientId'],
              clientName: sale['clientName'],
              products: sale['products'],
              total: sale['total'],
              createdAt: sale['createdAt'],
              status: sale['status'],
              userId: sale['userId'],
            });
          });
        });
    }, 1000);
  }

  deleteItem(id: string) {
    alert('Não é possível excluir uma venda!');
    return;
    this.saleService.deleteSale(id).then(() => {
      console.log('Venda excluída com sucesso!');
      this.getSales();
    });
  }
}
