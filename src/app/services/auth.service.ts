// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  message: string;
  success_key: number;
  full_name: string;
  usuario: string;
  sid: string;
  csrf_token: string;
  site_name: string;
  home_page: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly LOGIN_URL = `${environment.apiUrl}/api/method/okmedic.apirest.public.login`;
  private readonly SID_KEY = 'okmedic_sid';
  private readonly CSRF_TOKEN_KEY = 'okmedic_csrf_token';

  constructor(private http: HttpClient) {}

// auth.service.ts
login(credentials: { usr: string; pwd: string }): Observable<any> {
  return this.http.post(this.LOGIN_URL, credentials).pipe(
    tap((res: any) => {
      if (res.success_key === 1 && res.token) {
        localStorage.setItem('auth_token', res.token); // "token ak_xxx:as_xxx"
        localStorage.setItem('user', res.usuario);
        // Opcional: también guardar sid si usas UI Frappe
        // localStorage.setItem('sid', res.sid);
      }
    })
  );
}

  logout(): void {
    localStorage.removeItem(this.SID_KEY);
    localStorage.removeItem(this.CSRF_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.SID_KEY);
  }

  getSid(): string | null {
    return localStorage.getItem(this.SID_KEY);
  }

  getCsrfToken(): string | null {
    return localStorage.getItem(this.CSRF_TOKEN_KEY);
  }
}