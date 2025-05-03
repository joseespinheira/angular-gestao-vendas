import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [],
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  logoff(): void {
    localStorage.removeItem('user');
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  navigateTo(value: string): void {
    this.router.navigate([value]);
  }
}
