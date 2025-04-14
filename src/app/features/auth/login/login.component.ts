import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  constructor(private router: Router) {}

  login() {
    this.authService
      .login(this.email, this.password)
      .then(() => this.router.navigate(['/sales']))
      .catch((err) => {
        console.error('Login failed', err);
        this.showErrorDialog(err.message); // Exibe o modal com a mensagem de erro
      });
  }

  showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message },
    });
  }

  navigateToRegister() {
    this.router.navigate(['/login/register']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/login/forgot-password']);
  }

  texto() {
    let texto = 'texto()';
    return texto;
  }
}
