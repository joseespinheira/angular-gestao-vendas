import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ErrorDialogComponent } from '@shared/components/error-dialog/error-dialog.component';
import { getFriendlyFirebaseErrorMessage } from '@shared/utils/firebase-error-messages';
import { ErrorTypeEnum } from '../../../core/enums/error-type.enum';

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
      .then(() => {
        // salvar os dados do usuario na tabela DadosUsuario do firebase
        this.authService
          .getUserData()
          .then((data) => {
            localStorage.setItem('user', JSON.stringify(data));
          })
          .catch((error) => {
            throw error;
          });
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        const friendlyMessage = getFriendlyFirebaseErrorMessage(err.message);
        this.showErrorDialog(friendlyMessage);
      });
  }

  showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message, type: ErrorTypeEnum.Error },
    });
  }

  navigateToRegister() {
    this.router.navigate(['login/register']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['login/forgot-password']);
  }
}
