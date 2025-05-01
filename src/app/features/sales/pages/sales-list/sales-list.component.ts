import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaleService } from '../../../../core/services/sale.service';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'],
  imports: [CommonModule],
})
export class SalesListComponent implements OnInit {
  private router = inject(Router);
  private saleService = inject(SaleService);
  sales = [
    { id: 1, client: 'Cliente A', total: 150.0, date: '2025-04-13' },
    {
      id: 2,
      client: 'Cliente B',
      total: 200.0,
      date: '2025-04-12',
      status: 'Pago',
    },
    { id: 3, client: 'Cliente C', total: 300.0, date: '2025-04-11' },
  ];

  ngOnInit(): void {}

  navigateTo(value: string) {
    this.router.navigate([value]);
  }

  getSales() {
    this.sales = [];
    setTimeout(() => {
      this.saleService.getSales().subscribe((sales) => {
        this.sales = sales.map((sale) => {
          return {
            id: sale.id,
            client: sale.clientName,
            total: sale.total,
            date: sale.createdAt,
            status: sale.status,
          };
        });
      });
    }, 1000);
  }
}
