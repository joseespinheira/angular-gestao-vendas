import { Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-page-base',
  template: '',
})
export class PageBaseComponent {
  title = 'angular-gestao-vendas';
  isLoggedIn = false;
  carregando = false;

  private authService = inject(AuthService);

  constructor() {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  SetCarregando(loading: boolean) {
    this.carregando = loading;
  }
}
