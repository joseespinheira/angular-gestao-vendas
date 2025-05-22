import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sale } from '@core/models/saleDTO';
import { SaleService } from '@core/services/sale.service';

@Component({
  selector: 'app-sales-details',
  templateUrl: './details.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule],
})
export class SalesDetailsComponent {
  private saleService = inject(SaleService);
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  saleId: string = '';
  sale: Sale = {} as Sale;

  constructor() {
    //pegar id da rota
    this.activatedRoute.params.subscribe((params) => {
      this.saleId = params['id'];
    });
  }

  ngOnInit(): void {
    this.getSalesDetails();
  }

  async getSalesDetails() {
    const sale = await this.saleService.getSaleDetails(this.saleId);
    this.sale = sale;
    console.log('Sale Details:', sale);
  }

  navigateTo(url: string) {
    // Implementar navegação para a URL desejada
    this.route.navigate([url]);
  }
}
