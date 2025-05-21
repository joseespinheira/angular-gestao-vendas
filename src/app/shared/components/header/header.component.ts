import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { HeaderService } from '../../../core/services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
  imports: [
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
  ],
})
export class HeaderComponent {
  title = 'Sistema de Vendas';
  subtitle = 'Gerenciamento de Vendas e Produtos';

  isLoggedIn = false; // Simula o estado de login do usuário
  @Input() sidenav: MatSidenav = {} as MatSidenav;

  private authService = inject(AuthService);
  private headerService = inject(HeaderService);

  constructor() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    this.headerService.title$.subscribe((title) => {
      this.title = title;
    });
  }
}
