// src/app/auth/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UnidadMedica } from '../../services/auth.service';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
 

@Component({
  selector: 'app-login',
  standalone: true,
imports: [NgFor, NgIf, TitleCasePipe,NgClass,FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  credentials = { usr: '1803640091', pwd: 'App.2025', unidad_medica: '' };
  error = '';
  loading = false;
  unidadesMedicas: UnidadMedica[] = [];
  cargandoUnidades = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUnidadesMedicas();
    
    // Si ya hay una unidad seleccionada, la preseleccionamos
    const unidadGuardada = this.authService.getUnidadMedicaSeleccionada();
    if (unidadGuardada) {
      this.credentials.unidad_medica = unidadGuardada;
    }
  }

  private cargarUnidadesMedicas(): void {
    // Aseguramos que el estado de carga se active
    this.cargandoUnidades = true;
    this.error = ''; // Limpiamos errores previos

    this.authService.getUnidadesMedicas().subscribe({
      next: (response:any) => {
        console.log('Unidades médicas cargadas:', response);
        this.unidadesMedicas = response.message || [];
        console.log('Unidades médicas cargadas:', this.unidadesMedicas);
        this.cargandoUnidades = false;
        
        // Si solo hay una unidad, la seleccionamos automáticamente
        if (this.unidadesMedicas.length === 1 && !this.credentials.unidad_medica) {
            console.log('solo una unidad:', this.unidadesMedicas.length );
          this.credentials.unidad_medica = this.unidadesMedicas[0].name;

            console.log('unidad_medica:', this.credentials.unidad_medica);
        }
        
        // Si no hay unidades, mostramos un mensaje
        if (this.unidadesMedicas.length === 0) {
          this.error = 'No se encontraron unidades médicas disponibles.';
        }
      },
      error: (err:any) => {
        console.error('Error al cargar unidades médicas:', err);
        this.cargandoUnidades = false;
        this.error = 'No se pudieron cargar las unidades médicas. Por favor, intente nuevamente.';
      }
    });
  }

  onLogin(): void {
    this.error = '';
    this.loading = true;

    if (!this.credentials.unidad_medica) {
      this.loading = false;
      this.error = 'Por favor, seleccione una unidad médica.';
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (res:any) => {
        console.log('Respuesta de login:', res);
        
        const profesionalGuardado = this.authService.getProfesionalSalud();
        
        if (res.message.success_key === 1 && res.message.token) {
          if (profesionalGuardado) {
            this.router.navigate(['/dashboard']);
          } else {
            this.loading = false;
            this.error = 'Su cuenta no está asociada a un profesional de la salud. Contacte al administrador.';
          }
        } else {
          this.loading = false;
          this.error = res.message?.message || 'Error en la autenticación.';
        }
      },
      error: (err:any) => {
        this.loading = false;
        // Manejo de errores más específico
        if (err.status === 0) {
          this.error = 'Error de conexión. Verifique su conexión a internet.';
        } else if (err.status === 401) {
          this.error = 'Credenciales inválidas.';
        } else {
          this.error = 'Error al iniciar sesión. Por favor, intente nuevamente.';
        }
        console.error('Login error:', err);
      },
    });
  }
}