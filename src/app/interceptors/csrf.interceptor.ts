// src/app/interceptors/csrf.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const csrfToken = authService.getCsrfToken();

  if (csrfToken) {
    const cloned = req.clone({
      withCredentials: true,
      headers: req.headers.set('X-Frappe-CSRF-Token', csrfToken),
    });
    return next(cloned);
  }

  return next(req);
};