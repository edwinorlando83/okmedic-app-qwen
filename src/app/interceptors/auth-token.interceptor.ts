// interceptors/auth-token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: token, // ← Así es como Frappe espera el token
      },
      withCredentials: true, // Opcional: útil si compartes sesión
    });
    return next(cloned);
  }
  return next(req);
};