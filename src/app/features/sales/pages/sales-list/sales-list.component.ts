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
              totalPaid: sale['totalPaid'],
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
    const pdfFile = new File([pdfBlob], 'lista-de-produtos.pdf', {
      type: 'application/pdf',
    });

    // Tenta compartilhar usando a Web Share API (se disponível)
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      navigator
        .share({
          title: 'Lista de Produtos',
          text: 'Confira a lista de produtos em PDF.',
          files: [pdfFile],
        })
        .catch((error) => {
          // Se o usuário cancelar ou der erro, apenas faça o download normalmente
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'lista-de-produtos.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        });
    } else {
      // Fallback: download normal
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lista-de-produtos.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  }

  exportListComplete(): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Lista Completa de Vendas', 14, 20);

    // Monta as linhas da tabela principal + produtos
    const body: any[] = [];
    this.filteredSales.forEach((sale) => {
      // Linha da venda

      // Cabeçalho dos produtos (linha única, mesclando as 4 colunas)
      body.push([
        {
          content: 'Produtos:',
          colSpan: 4,
          styles: { halign: 'left', fontSize: 12, textColor: [41, 128, 185] },
        },
      ]);
      body.push([
        {
          content: 'Nome',
          styles: { fillColor: [166, 60, 227], textColor: [255, 255, 255] },
        },
        {
          content: 'Quantidade',
          styles: { fillColor: [166, 60, 227], textColor: [255, 255, 255] },
        },
        {
          content: 'Valor unitário',
          styles: { fillColor: [166, 60, 227], textColor: [255, 255, 255] },
        },
        {
          content: 'Subtotal',
          styles: { fillColor: [166, 60, 227], textColor: [255, 255, 255] },
        },
      ]);
      // Linhas dos produtos
      sale.products.forEach((product) => {
        body.push([
          {
            content: `${product.name}`,
            styles: { fontSize: 10 },
          },
          { content: `${product.stock}`, styles: { fontSize: 10 } },
          {
            content: `${product.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}`,
            styles: { fontSize: 10 },
          },
          {
            content: `${(product.stock * product.price).toLocaleString(
              'pt-BR',
              { style: 'currency', currency: 'BRL' }
            )}`,
            styles: { fontSize: 10 },
          },
        ]);
      });
      body.push([
        {
          content: sale.clientName,
          styles: {
            fontStyle: 'bold',
            fillColor: [110, 40, 150],
            textColor: [255, 255, 255],
          },
        },
        {
          content:
            'Total: ' +
            sale.total.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
          styles: {
            fontStyle: 'bold',
            fillColor: [110, 40, 150],
            textColor: [255, 255, 255],
          },
        },
        {
          content: new Date(sale.createdAt).toLocaleDateString('pt-BR'),
          styles: {
            fontStyle: 'bold',
            fillColor: [110, 40, 150],
            textColor: [255, 255, 255],
          },
        },
        {
          content: 'Status: ' + sale.status,
          styles: {
            fontStyle: 'bold',
            fillColor: [110, 40, 150],
            textColor: [255, 255, 255],
          },
        },
      ]);

      // Linha em branco para separar vendas
      body.push([
        {
          content: '',
          colSpan: 4,
          styles: { cellPadding: 2, fontSize: 2, lineWidth: 0 },
        },
      ]);
    });

    autoTable(doc, {
      head: [],
      body,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [166, 60, 227] },
      margin: { left: 14, right: 14 },
      theme: 'grid',
    });

    // Data de geração
    const dataGeracao = new Date().toLocaleString('pt-BR');
    doc.setFontSize(10);
    doc.text(
      `Data de Geração: ${dataGeracao}`,
      14,
      (doc as any).lastAutoTable.finalY + 10
    );

    // Total geral
    const totalGeral = this.filteredSales.reduce((acc, sale) => {
      return (
        acc +
        sale.products.reduce((acc, product) => {
          return acc + product.stock * product.price;
        }, 0)
      );
    }, 0);
    doc.setFontSize(14);
    const totalText = `Total a pagar: ${totalGeral.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(totalText);
    const x = (pageWidth - textWidth) / 2;
    const y = (doc as any).lastAutoTable.finalY + 20;
    doc.setLineWidth(0.5);
    doc.line(14, y - 6, pageWidth - 14, y - 6);
    doc.setFont('undefined', 'bold');
    doc.text(totalText, x, (doc as any).lastAutoTable.finalY + 20);
    // Adiciona o rodapé
    const footerText = 'App Gestão de Vendas';
    const footerY = doc.internal.pageSize.height - 10; // 10 unidades acima da parte inferior da página
    const footerWidth = doc.getTextWidth(footerText);
    const footerX = (doc.internal.pageSize.width - footerWidth) / 2; // Centraliza o texto
    doc.setFontSize(10);
    doc.text(footerText, footerX, footerY);
    doc.setFontSize(8);
    doc.text('Desenvolvido por: José Espinheira', footerX, footerY + 5); // Adiciona o nome do desenvolvedor

    // Download/compartilhamento
    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], 'lista-completa-vendas.pdf', {
      type: 'application/pdf',
    });

    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-completa-vendas.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  exportListProducts(): void {
    const doc = new jsPDF();

    // Título do PDF
    doc.setFontSize(18);
    doc.text('Extrato de Produtos', 14, 20);
    doc.setFontSize(10);
    doc.text('App Gestão de Vendas', 14, 25);
    doc.setFontSize(14);
    // Configuração da tabela
    const tableData = this.filteredSales.flatMap((sale) =>
      sale.products.map((product) => [
        product.name,
        product.stock,
        product.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        (product.stock * product.price).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        new Date(sale.createdAt).toLocaleDateString('pt-BR'),
      ])
    );

    autoTable(doc, {
      head: [['Produto', 'Quantidade', 'Valor un.', 'Total', 'Data']],
      body: tableData,
      startY: 30,
    });

    // Adiciona data e hora do documento gerado
    const dataGeracao = new Date().toLocaleString('pt-BR');
    doc.setFontSize(10); // Define fonte menor para a data
    doc.text(
      `Data de Geração: ${dataGeracao}`,
      14,
      (doc as any).lastAutoTable.finalY + 10
    );

    const totalGeral = this.filteredSales.reduce((acc, sale) => {
      return (
        acc +
        sale.products.reduce((acc, product) => {
          return acc + product.stock * product.price;
        }, 0)
      );
    }, 0);

    // Adiciona o total geral centralizado
    doc.setFontSize(14);
    const totalText = `Total a pagar: ${totalGeral.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(totalText);
    const x = (pageWidth - textWidth) / 2;
    const y = (doc as any).lastAutoTable.finalY + 20;

    // Linha horizontal (tipo <hr>) acima do total
    const margin = 14; // mesma margem usada no texto
    doc.setLineWidth(0.5);
    doc.line(margin, y - 6, pageWidth - margin, y - 6);

    doc.setFont('undefined', 'bold'); // Define o texto como negrito

    doc.text(totalText, x, (doc as any).lastAutoTable.finalY + 20);

    // Gerar o PDF como blob
    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], 'lista-de-produtos.pdf', {
      type: 'application/pdf',
    });

    // Tenta compartilhar usando a Web Share API (se disponível)
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      navigator
        .share({
          title: 'Lista de Produtos',
          text: 'Confira a lista de produtos em PDF.',
          files: [pdfFile],
        })
        .catch((error) => {
          // Se o usuário cancelar ou der erro, apenas faça o download normalmente
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'lista-de-produtos.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        });
    } else {
      // Fallback: download normal
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lista-de-produtos.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
  }
}
