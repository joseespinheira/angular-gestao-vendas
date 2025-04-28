import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private maxCharactersSubject = new BehaviorSubject<number>(
    this.calculateMaxCharacters()
  );
  maxCharacters$ = this.maxCharactersSubject.asObservable();

  constructor() {
    // Atualiza o valor inicial
    this.updateMaxCharacters();
    // Adiciona um listener para mudanças no tamanho da janela
    window.addEventListener('resize', () => this.updateMaxCharacters());
  }

  private updateMaxCharacters(): void {
    const maxCharacters = this.calculateMaxCharacters();
    this.maxCharactersSubject.next(maxCharacters);
  }

  private calculateMaxCharacters(): number {
    return window.innerWidth > 739 ? 20 : 10;
  }
}
