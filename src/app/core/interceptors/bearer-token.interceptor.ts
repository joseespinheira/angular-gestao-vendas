import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, lastValueFrom } from 'rxjs';

// needs to add this function because getting the token is async
const addBearerToken = async (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Promise<HttpEvent<any>> => {
  const auth = inject(Auth);
  const firebaseUser = auth.currentUser;
  const token = await firebaseUser?.getIdToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return lastValueFrom(next(req)).catch((err) => {
    console.error('Error in bearer token interceptor', err);
    throw err; // Rethrow the error to propagate it to the caller});
  });
};
export const bearerTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // only add the bearer token to requests to the backend
  // Note that you can customize it to only add the bearer token to certain requests
  if (req.url.startsWith('environment.backendUrl')) {
    return from(addBearerToken(req, next));
  } else {
    return next(req);
  }
};
