import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [],
  imports: [
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class NavbarComponent {
  private router = inject(Router);

  @Input() sidenav: MatSidenav = {} as MatSidenav;

  redirectTo(url: string) {
    // Verifica se for / deve deslogar o usuario
    if (url === '/login' || url === '/') {
      localStorage.removeItem('user');
    }

    this.sidenav.close();
    this.router.navigate([url]);
  }
}
