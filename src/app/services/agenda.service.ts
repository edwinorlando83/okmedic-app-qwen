// src/app/services/agenda.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { CitaEnCurso, CitaProgramada, RespuestaAgendaDoctor } from '../interfaces/interfaces';

// Interfaces (puedes mover estas desde agenda.component.ts si ya las tienes allí) 
 

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private readonly API_URL = `${environment.apiUrl}/api/method`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAgendaDoctor(
    okm_profsalud_name: string, 
    unimed_codigo: string, 
    fecha: string
  ): Observable<RespuestaAgendaDoctor> {
    
    const url = `${this.API_URL}/okmedic.servicios.agenda.getAgendaDoctor`;
    
    const body = {
      okm_profsalud_name,
      unimed_codigo,
      fecha
    };

 
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': this.authService.getToken() || '' 
    });

    return this.http.post<RespuestaAgendaDoctor>(url, body, { headers });
  }

 
/**
   * Obtiene las citas programadas para un profesional en una unidad.
   * 
   * @param okm_profsalud_name El ID del profesional.
   * @param unimed_codigo El código de la unidad médica.
   * @returns Un observable con la lista de citas programadas.
   */
  getCitasProgramadas(okm_profsalud_name: string, unimed_codigo: string): Observable<{ message: CitaProgramada[] }> {
    const url = `${this.API_URL}/okmedic.servicios.agenda.getCitasConPacientes`;

    const body = {
      okm_profsalud_name,
      unimed_codigo
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getToken() || ''
    });

    return this.http.post<{ message: CitaProgramada[] }>(url, body, { headers });
  }
/**
   * Cancela la asignación de un paciente a una cita.
   * 
   * @param agenda_name El nombre (ID) de la cita (OKM_AGENDA).
   * @returns Un observable con el mensaje de éxito.
   */
  cancelarAsignacion(agenda_name: string): Observable<{ message: string }> {
    const url = `${this.API_URL}/okmedic.servicios.agenda.cancelar_asignacion`;

    const body = {
      agenda_name: agenda_name
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getToken() || ''
    });

    return this.http.post<{ message: string }>(url, body, { headers });
  }

  /**
   * Obtiene las atenciones en proceso para un profesional en una unidad.
   * 
   * @param okm_profsalud_name El ID del profesional (puede ser null para el actual).
   * @param unimed_codigo El código de la unidad médica.
   * @returns Un observable con la lista de citas en curso.
   */
  getAtencionesEnProceso(okm_profsalud_name: string | null, unimed_codigo: string): Observable<{ message: CitaEnCurso[] }> {
    const url = `${this.API_URL}/okmedic.servicios.agenda.getAtencionesEnProceso`;

    const body = {
      okm_profsalud_name, // Puede ser "null" como string o un ID real
      unimed_codigo
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getToken() || ''
    });

    return this.http.post<{ message: CitaEnCurso[] }>(url, body, { headers });
  }

  /**
   * Obtiene las atenciones finalizadas para un profesional en una unidad.
   * 
   * @param okm_profsalud_name El ID del profesional.
   * @param unimed_codigo El código de la unidad médica.
   * @returns Un observable con la lista de citas finalizadas/completadas.
   */
  getAtencionesFinalizadas(okm_profsalud_name: string, unimed_codigo: string): Observable<{ message: CitaEnCurso[] }> {
    const url = `${this.API_URL}/okmedic.servicios.agenda.getAtencionesFinalizadas`;

    const body = {
      okm_profsalud_name,
      unimed_codigo
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authService.getToken() || ''
    });

    return this.http.post<{ message: CitaEnCurso[] }>(url, body, { headers });
  }

}