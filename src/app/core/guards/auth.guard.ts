import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      take(1), // Garante que o Observable será completado após a primeira emissão
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']); // Redireciona para a tela de login
          return false;
        }
        return true;
      })
    );
  }
}
