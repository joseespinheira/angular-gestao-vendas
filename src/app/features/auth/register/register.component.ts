import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [],
  imports: [FormsModule],
})
export class RegisterComponent {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  register() {
    if (this.password.length < 8) {
      console.error('Password must be at least 8 characters long');
      return;
    }
    this.authService
      .register(this.email, this.password)
      .then(() => {
        console.log('Registration successful');
        this.router.navigate(['/login']);
      })
      .catch((err) => console.error('Registration failed', err));
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
