import { Component } from '@angular/core';

@Component({
  selector: 'app-page-base',
  template: '',
})
export class PageBaseComponent {
  title = 'angular-gestao-vendas';
  // isLoggedIn = false;
  loading = false;

  // private authService = inject(AuthService);

  constructor() {}

  SetCarregando(loading: boolean) {
    this.loading = loading;
  }
}
