import { HttpHandlerFn } from '@angular/common/http';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
} from '@angular/common/module.d-CnjH8Dlt';
import { catchError, Observable, throwError } from 'rxjs';

export function autenticacaoInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  // Aqui você pode adicionar o token de autenticação ao cabeçalho da requisição, se necessário
  const token = localStorage.getItem('token') || ''; // Substitua pela lógica de obtenção do token

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Aqui você pode lidar com erros de autenticação, como redirecionar para a página de login
      if (
        error.status === 401 ||
        error.status === 403 ||
        error.status === 400
      ) {
        // Redirecionar para a página de login ou exibir uma mensagem de erro
        console.error('Erro de autenticação:', error);
      }
      return throwError(error); // Repassa o erro para o próximo manipulador
    })
  );
}
