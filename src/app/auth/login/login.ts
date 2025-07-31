// src/app/auth/login.component.ts
import { Component } from '@angular/core';
import { NgModel, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  credentials = { usr: 'Administrator', pwd: 'admin' };
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

 
// src/app/auth/login.component.ts
onLogin(): void {
  this.error = '';
  this.loading = true;

this.authService.login(this.credentials).subscribe({
  next: (res) => {
    console.log('Login exitoso', res);

    // ✅ Guardamos el token y el sid
    localStorage.setItem('auth_token', res.message.token); // "token key:secret"
    localStorage.setItem('user', res.message.usuario);
    // Opcional: guardar sid si rediriges a /app o usas cookies
    // localStorage.setItem('sid', res.message.sid);

    // ✅ Navegamos
    this.router.navigate(['/dashboard']);
  },
  error: (err) => {
    this.loading = false;
    this.error = 'Error al iniciar sesión.';
  }
});
}


}