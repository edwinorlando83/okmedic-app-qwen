// src/app/services/agenda.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

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

  // Aquí puedes agregar más métodos relacionados con la agenda
  // como getCitasProgramadas, getCitasEnCurso, etc.
}