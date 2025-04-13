import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => this.router.navigate(['/sales']))
      .catch(err => console.error('Login failed', err));
  }

  navigateToRegister() {
    this.router.navigate(['/login/register']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/login/forgot-password']);
  }

  texto() {
    console.log('Texto do login component');
    var texto = 'Texto do login component';
    const a = environment.firebase.messagingSenderId 
    if (a) {
      return a;
    }
    return texto;
  }
}