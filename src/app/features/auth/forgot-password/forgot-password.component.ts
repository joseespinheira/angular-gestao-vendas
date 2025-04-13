import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [],
  imports: [FormsModule],
})
export class ForgotPasswordComponent {
  email = '';

  constructor(private authService: AuthService, private router: Router) {}

  recoverPassword() {
    this.authService.recoverPassword(this.email)
      .then(() => {
        console.log('Password recovery email sent');
        this.router.navigate(['/login']);
      })
      .catch(err => console.error('Password recovery failed', err));
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}