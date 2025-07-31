// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const sid = this.authService.getSid();
    if (sid) {
      const cloned = req.clone({
        withCredentials: true,
        headers: req.headers.set('X-Frappe-CSRF-Token', sid),
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}