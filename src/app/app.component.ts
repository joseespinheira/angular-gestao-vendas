import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { HeaderService } from './core/services/header.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    CommonModule,
    NavbarComponent,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-gestao-vendas';
  // isLoggedIn = false;
  navigationHistory: string[] = [];
  private navigationSubscription!: Subscription;
  private headerService = inject(HeaderService);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.navigationSubscription = this.headerService
      .getNavigationChanges()
      .subscribe((navigation) => {
        this.navigationHistory = navigation;
      });
  }
}
