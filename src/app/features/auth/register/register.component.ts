import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [FormsModule],
})
export class RegisterComponent {
  email = '';
  password = '';
  phone = '';
  cpf = '';
  cpfInvalid = false;
  showErrors = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {}

  register(form: NgForm) {
    // Exibe os erros se o formulário for inválido
    if (form.invalid || this.cpfInvalid) {
      this.showErrors = true;
      console.error('Formulário inválido');
      return;
    }

    this.authService
      .register(this.email, this.password)
      .then(() => {
        return this.authService.saveUserData(this.email, this.phone, this.cpf);
      })
      .then(() => {
        console.log('Cadastro realizado com sucesso');
        this.router.navigate(['/login']);
      })
      .catch((err) => console.error('Falha no cadastro', err));
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onCpfInput() {
    const rawCpf = this.cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    // Valida o CPF quando o usuário digitar 11 caracteres
    if (rawCpf.length === 11) {
      this.validateCpf(rawCpf)
        ? (this.cpfInvalid = false)
        : (this.cpfInvalid = true);
    } else {
      this.cpfInvalid = false; // Reseta a validação enquanto o CPF não tem 11 caracteres
    }
  }

  formatCpf() {
    const rawCpf = this.cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    // Completa o CPF com zeros à esquerda, se necessário
    this.cpf = rawCpf.padStart(11, '0');
    this.cpfInvalid = !this.validateCpf(rawCpf);
  }

  validateCpf(cpf: string): boolean {
    // Validação de CPF (algoritmo de validação)
    let sum = 0;
    let remainder;

    if (cpf === '00000000000') return false;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
  }
}
