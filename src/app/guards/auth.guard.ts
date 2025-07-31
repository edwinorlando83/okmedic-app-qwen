// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

// auth.guard.ts
canActivate(): boolean {
  const loggedIn = !!localStorage.getItem('auth_token');
  console.log('[AuthGuard] ¿Está logueado?', loggedIn);
  if (!loggedIn) {
    this.router.navigate(['/login']);
  }
  return loggedIn;
}
}