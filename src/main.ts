// filepath: c:\xampp\htdocs\angular-gestao-vendas\src\main.ts
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { enableProdMode, LOCALE_ID } from '@angular/core';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { autenticacaoInterceptor } from './app/core/interceptors/http.interceptor';
import { environment } from './environments/environment';

// Registrar a localização 'pt-BR'
registerLocaleData(localePt);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Define a localização global
    provideHttpClient(withInterceptors([autenticacaoInterceptor])),
    provideNgxMask(), // Configuração do ngx-mask
  ],
}).catch((err) => {
  console.error(err);
});
