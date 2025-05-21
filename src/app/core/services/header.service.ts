import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private title: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Gestão de Vendas'
  );
  title$ = this.title.asObservable(); // Observable para escutar alterações no título
  private subtitle: string = 'Bem-vindo ao sistema de vendas!';
  private navigationKey: string = 'navigation'; // Chave para o localStorage
  private navigationSubject = new BehaviorSubject<string[]>(
    this.getNavigation()
  );

  constructor(private router: Router) {
    this.listenToRouterEvents();
  }

  // Métodos para título e subtítulo
  getTitle(): string {
    return this.title.value;
  }

  setTitle(newTitle: string): void {
    this.title.next(newTitle);
  }

  setTitleDefault(): void {
    this.title.next('Gestão de Vendas');
  }

  getSubtitle(): string {
    return this.subtitle;
  }

  setSubtitle(newSubtitle: string): void {
    this.subtitle = newSubtitle;
  }

  // Métodos para gerenciar navegação
  addNavigationStep(step: string): void {
    const navigation = this.getNavigation();
    navigation.push(step);
    localStorage.setItem(this.navigationKey, JSON.stringify(navigation));
    this.navigationSubject.next(navigation); // Emite a alteração
  }

  removeLastNavigationStep(): void {
    const navigation = this.getNavigation();
    navigation.pop(); // Remove o último passo
    localStorage.setItem(this.navigationKey, JSON.stringify(navigation));
    this.navigationSubject.next(navigation); // Emite a alteração
  }

  clearNavigation(): void {
    localStorage.removeItem(this.navigationKey); // Limpa o histórico
    this.navigationSubject.next([]); // Emite a alteração
  }

  getNavigation(): string[] {
    const navigation = localStorage.getItem(this.navigationKey);
    return navigation ? JSON.parse(navigation) : [];
  }

  getCurrentPage(): string | null {
    const navigation = this.getNavigation();
    return navigation.length > 0 ? navigation[navigation.length - 1] : null;
  }

  getPreviousPage(): string | null {
    const navigation = this.getNavigation();
    return navigation.length > 1 ? navigation[navigation.length - 2] : null;
  }

  // Observable para escutar alterações no histórico
  getNavigationChanges() {
    return this.navigationSubject.asObservable();
  }

  // Escuta eventos de navegação do Angular Router
  private listenToRouterEvents(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        const navigation = this.getNavigation();

        const existingIndex = navigation.indexOf(currentUrl);

        if (existingIndex !== -1) {
          // Se a rota já existe, remove todas as rotas intermediárias
          const updatedNavigation = navigation.slice(0, existingIndex + 1);
          localStorage.setItem(
            this.navigationKey,
            JSON.stringify(updatedNavigation)
          );
          this.navigationSubject.next(updatedNavigation);
        } else {
          // Caso contrário, adiciona a nova rota ao histórico
          this.addNavigationStep(currentUrl);
        }
      });
  }
}
