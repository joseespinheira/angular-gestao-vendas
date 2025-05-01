import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Client } from '@core/models/clientDTO';
import { ClientService } from '@core/services/client.service';
import { ScreenService } from '@core/services/screen.service';
import { PageBaseComponent } from '@shared/components/page-base/page-base.component';

@Component({
  selector: 'app-clients-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
})
export class ClientsListComponent extends PageBaseComponent implements OnInit {
  private router = inject(Router);
  private screenService = inject(ScreenService);
  private clientService = inject(ClientService);
  private dialog = inject(MatDialog);

  clients: Client[] = [];
  maxCharacters$ = this.screenService.maxCharacters$;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.getClients();
  }

  getClients() {
    this.clients = [];
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data.map((item) => {
          return new Client({
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

  showDetails(client: any): void {
    alert(`Detalhes do Produto:\n${JSON.stringify(client, null, 2)}`);
  }

  deleteClient(clientId: string): void {
    this.clientService.deleteClient(clientId).then(() => {
      this.getClients();
      return;
    });
  }
}
