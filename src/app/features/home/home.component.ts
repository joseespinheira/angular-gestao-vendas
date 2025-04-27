import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorTypeEnum } from '@core/enums/error-type.enum';
import { AuthService } from '@core/services/auth.service';
import { ErrorDialogComponent } from '@shared/components/error-dialog/error-dialog.component';

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
    switch (value) {
      case 'sales':
        this.router.navigate(['/sales']);
        break;
      default:
        this.dialog.open(ErrorDialogComponent, {
          data: { message: 'Em construção', type: ErrorTypeEnum.Info },
        });
        break;
    }
  }
}
