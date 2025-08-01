// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('AuthGuard canActivate ejecutado');
    const loggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard loggedIn (con profesional):', loggedIn);
    
    if (loggedIn) {
      console.log('AuthGuard: Acceso permitido');
      return true;
    } else {
      console.log('AuthGuard: Redirigiendo a login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}