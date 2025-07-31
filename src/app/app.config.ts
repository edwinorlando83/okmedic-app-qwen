// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http'; // ← Cambia aquí
 
 
import { authTokenInterceptor } from './interceptors/auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // ← Usa esto
    // Registra el interceptor como proveedor
  provideHttpClient(withInterceptors([authTokenInterceptor])),
  ],
};