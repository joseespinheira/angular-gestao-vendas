import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Sale } from '@core/models/saleDTO';
import { SaleService } from '@core/services/sale.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { take } from 'rxjs';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
  ],
})
export class SalesListComponent implements OnInit {
  private router = inject(Router);
  private saleService = inject(SaleService);
  sales: Sale[] = [];

  filteredSales: Sale[] = [];
  filter = {
    clientName: '',
    createdAt: null,
    status: '',
  };

  ngOnInit(): void {
    this.getSales();
  }

  navigateTo(value: string) {
    this.router.navigate([value]);
  }

  applyFilter(filterPanel: MatExpansionPanel): void {
    this.filteredSales = this.sales.filter((sale) => {
      const matchesClient =
        !this.filter.clientName ||
        sale.clientName
          .toLowerCase()
          .includes(this.filter.clientName.toLowerCase());
      const matchesDate =
        !this.filter.createdAt ||
        new Date(sale.createdAt).toDateString() ===
          new Date(this.filter.createdAt).toDateString();
      const matchesStatus =
        !this.filter.status || sale.status === this.filter.status;

      return matchesClient && matchesDate && matchesStatus;
    });

    filterPanel.close();
  }

  clearFilter(): void {
    this.filter = {
      clientName: '',
      createdAt: null,
      status: '',
    };
    this.filteredSales = [...this.sales]; // Restaura a lista original
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
          this.filteredSales = [...this.sales];
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

  exportList(): void {
    const doc = new jsPDF();

    // Título do PDF
    doc.setFontSize(18);
    doc.text('Lista de Produtos', 14, 20);

    // Configuração da tabela
    const tableData = this.filteredSales.map((sale) => [
      sale.clientName,
      sale.total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      new Date(sale.createdAt).toLocaleDateString('pt-BR'),
      sale.status,
    ]);

    autoTable(doc, {
      head: [['Cliente', 'Total', 'Data', 'Situação']],
      body: tableData,
      startY: 30,
    });

    // Gerar o PDF como blob
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);

    // Criar um link temporário para download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-de-produtos.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Abrir o PDF em uma nova aba (útil para Android e desktop)
    window.open(url, '_blank');

    // Opcional: liberar o objeto URL após algum tempo
    setTimeout(() => URL.revokeObjectURL(url), 10000);

    // // Gerar o PDF como blob e abrir em nova aba

    // // Salvar o PDF como arquivo
    // const pdfFileName = 'lista-de-produtos.pdf';
    // doc.save(pdfFileName);
    // window.open(pdfFileName, '_blank');

    // Gerar link para compartilhamento via WhatsApp
    // const pdfBlob = doc.output('blob');
    // const fileReader = new FileReader();
    // fileReader.onload = () => {
    //   const base64PDF = fileReader.result as string;
    //   const pdfDataURL = `data:application/pdf;base64,${
    //     base64PDF.split(',')[1]
    //   }`;
    //   const whatsappMessage = `Confira a lista de vendas: ${pdfDataURL}`;
    //   const whatsappURL = `https://wa.me/?text=${encodeURIComponent(
    //     whatsappMessage
    //   )}`;
    //   window.open(whatsappURL, '_blank');
    // };
    // fileReader.readAsDataURL(pdfBlob);
  }
}
