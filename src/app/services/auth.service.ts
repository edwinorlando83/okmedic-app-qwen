// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, forkJoin, of } from 'rxjs'; // ✅ Importamos forkJoin y of
import { environment } from '../../environments/environment';

// Interfaces (manteniendo las existentes y añadiendo la nueva)
export interface ProfesionalSalud {
  nombre: string;
  id: string;
  cedula: string;
  telefono: string;
  email: string;
  rol: string;
  foto: string;
}

export interface UnidadMedica {
  name: string; // ID de la unidad
  unimed_nombre: string; // Nombre de la unidad
}

export interface LoginResponse {
  message: {
    success_key: number;
    message: string;
    sid: string;
    usuario: string;
    profesional_salud: ProfesionalSalud | null;
    token: string;
    site_name: string;
  };
  home_page: string;
  full_name: string;
}

// ✅ Nueva interfaz para la respuesta de unidades médicas
export interface UnidadesMedicasResponse {
  message: UnidadMedica[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly LOGIN_URL = `${environment.apiUrl}/api/method/okmedic.apirest.public.login`;
  private readonly UNIDADES_URL = `${environment.apiUrl}/api/method/okmedic.apirest.public.getUnidadMedica`; // ✅ URL del nuevo servicio
  private readonly TOKEN_KEY = 'okmedic_auth_token';
  private readonly USER_KEY = 'okmedic_user';
  private readonly PROFESIONAL_KEY = 'okmedic_profesional';
  private readonly UNIDAD_MEDICA_KEY = 'okmedic_unidad_medica'; // ✅ Nueva clave

  constructor(private http: HttpClient) { }
  getUnidadMedicaCodigo(): string | null {
    return this.getUnidadMedicaSeleccionada(); // Ya que 'name' de la unidad es el código
  }

  getProfesionalId(): string | null {
    const profesional = this.getProfesionalSalud();
    return profesional ? profesional.id : null;
  }

  getUnidadesMedicas(): Observable<UnidadesMedicasResponse> {
    // Como es un endpoint público, no necesitamos token
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<UnidadesMedicasResponse>(this.UNIDADES_URL, { headers });
  }


  login(credentials: { usr: string; pwd: string; unidad_medica?: string }): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Añadimos la unidad médica seleccionada a los datos de login si existe
    const loginData = credentials.unidad_medica
      ? { ...credentials, unidad_medica: credentials.unidad_medica }
      : credentials;

    return this.http
      .post<LoginResponse>(this.LOGIN_URL, loginData, { headers })
      .pipe(
        tap((res) => {
          if (res.message.success_key === 1 && res.message.token) {
            if (res.message.profesional_salud && Object.keys(res.message.profesional_salud).length > 0) {
              localStorage.setItem(this.TOKEN_KEY, res.message.token);
              localStorage.setItem(this.USER_KEY, res.message.usuario);
              localStorage.setItem(this.PROFESIONAL_KEY, JSON.stringify(res.message.profesional_salud));

              // ✅ Almacenar la unidad médica seleccionada si se proporcionó
              if (credentials.unidad_medica) {
                localStorage.setItem(this.UNIDAD_MEDICA_KEY, credentials.unidad_medica);
              }
              console.log('Login exitoso y datos guardados');
            } else {
              console.error('Login exitoso pero no se encontraron datos del profesional');
              this.logout();
            }
          } else {
            console.error('Login no exitoso según el servidor:', res.message.message);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.PROFESIONAL_KEY);
    localStorage.removeItem(this.UNIDAD_MEDICA_KEY); // ✅ Limpiar también la unidad
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const profesional = this.getProfesionalSalud();
    return !!(token && profesional);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  getProfesionalSalud(): ProfesionalSalud | null {
    const profesionalStr = localStorage.getItem(this.PROFESIONAL_KEY);
    if (profesionalStr) {
      try {
        return JSON.parse(profesionalStr);
      } catch (e) {
        console.error('Error al parsear datos del profesional:', e);
        return null;
      }
    }
    return null;
  }

  // ✅ Nuevo método para obtener la unidad médica almacenada
  getUnidadMedicaSeleccionada(): string | null {
    return localStorage.getItem(this.UNIDAD_MEDICA_KEY);
  }

  // ✅ Nuevo método para obtener el nombre de la unidad médica desde localStorage
  // (Esto es útil si necesitas mostrar el nombre sin hacer otra llamada)
  getNombreUnidadMedicaSeleccionada(unidades: UnidadMedica[]): string | null {
    const idUnidad = this.getUnidadMedicaSeleccionada();
    if (idUnidad) {
      const unidad = unidades.find(u => u.name === idUnidad);
      return unidad ? unidad.unimed_nombre : null;
    }
    return null;
  }
}