// src/app/services/frappe-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// Tipos genéricos para las respuestas de Frappe
interface FrappeListResponse<T> {
  data: T[];
}

interface FrappeSingleResponse<T> {
  data: T;
}

interface FrappeMessageResponse {
  message: any;
}

// Tipo para filtros
type FrappeFilterOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'in' | 'not in' | 'between';
type FrappeFilter = [string, FrappeFilterOperator, any];

// Opciones para listar documentos
interface ListOptions {
  fields?: string[];
  filters?: FrappeFilter[];
  orFilters?: FrappeFilter[];
  orderBy?: string; // e.g., "fieldname asc" or "fieldname desc"
  limitStart?: number;
  limitPageLength?: number;
  limit?: number; // Alias for limitPageLength
  asDict?: boolean;
  debug?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FrappeApiService {

  private readonly API_URL = `${environment.apiUrl}/api`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // --- Métodos Privados Auxiliares ---

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (token) {
      headers = headers.set('Authorization', token);
    }
    
    return headers;
  }

  private handleError(error: any) {
    console.error('Frappe API Error:', error);
    return throwError(() => error);
  }

  // --- Listing Documents ---

  /**
   * Obtiene una lista de documentos de un DocType.
   * 
   * @param doctype El nombre del DocType.
   * @param options Opciones para filtrar, ordenar y paginar.
   * @returns Un observable con la lista de documentos.
   */
  list<T>(doctype: string, options: ListOptions = {}): Observable<T[]> {
    let params = new HttpParams();

    // Añadir parámetros opcionales
    if (options.fields) {
      params = params.set('fields', JSON.stringify(options.fields));
    }
    if (options.filters) {
      params = params.set('filters', JSON.stringify(options.filters));
    }
    if (options.orFilters) {
      params = params.set('or_filters', JSON.stringify(options.orFilters));
    }
    if (options.orderBy) {
      // Asegurarse de codificar espacios en el ordenamiento
      params = params.set('order_by', options.orderBy);
    }
    if (options.limitStart !== undefined) {
      params = params.set('limit_start', options.limitStart.toString());
    }
    if (options.limitPageLength !== undefined) {
      params = params.set('limit_page_length', options.limitPageLength.toString());
    }
    if (options.limit !== undefined) {
      params = params.set('limit', options.limit.toString());
    }
    if (options.asDict !== undefined) {
      params = params.set('as_dict', options.asDict.toString());
    }
    if (options.debug) {
      params = params.set('debug', 'True');
    }

    const url = `${this.API_URL}/resource/${doctype}`;
    const headers = this.getHeaders();

    return this.http.get<FrappeListResponse<T>>(url, { headers, params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // --- CRUD Operations ---

  /**
   * Crea un nuevo documento.
   * 
   * @param doctype El nombre del DocType.
   * @param data Los datos del documento a crear.
   * @returns Un observable con el documento creado.
   */
  create<T>(doctype: string, data: Partial<T>): Observable<T> {
    const url = `${this.API_URL}/resource/${doctype}`;
    const headers = this.getHeaders();

    return this.http.post<FrappeSingleResponse<T>>(url, data, { headers })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un documento específico por su nombre.
   * 
   * @param doctype El nombre del DocType.
   * @param name El nombre (ID) del documento.
   * @returns Un observable con el documento.
   */
  get<T>(doctype: string, name: string): Observable<T> {
    const url = `${this.API_URL}/resource/${doctype}/${name}`;
    const headers = this.getHeaders();

    return this.http.get<FrappeSingleResponse<T>>(url, { headers })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza un documento existente.
   * 
   * @param doctype El nombre del DocType.
   * @param name El nombre (ID) del documento.
   * @param data Los campos a actualizar.
   * @returns Un observable con el documento actualizado.
   */
  update<T>(doctype: string, name: string, data: Partial<T>): Observable<T> {
    const url = `${this.API_URL}/resource/${doctype}/${name}`;
    const headers = this.getHeaders();

    return this.http.put<FrappeSingleResponse<T>>(url, data, { headers })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  /**
   * Elimina un documento.
   * 
   * @param doctype El nombre del DocType.
   * @param name El nombre (ID) del documento.
   * @returns Un observable que emite un mensaje de confirmación.
   */
  delete(doctype: string, name: string): Observable<any> {
    const url = `${this.API_URL}/resource/${doctype}/${name}`;
    const headers = this.getHeaders();

    return this.http.delete<FrappeMessageResponse>(url, { headers })
      .pipe(
        map(response => response.message),
        catchError(this.handleError)
      );
  }

  // --- Remote Method Calls ---

  /**
   * Llama a un método whitelisted de Python en Frappe.
   * 
   * @param methodPath La ruta del método (e.g., 'frappe.auth.get_logged_user').
   * @param params Parámetros para enviar con la solicitud GET.
   * @param body Cuerpo para enviar con la solicitud POST.
   * @returns Un observable con la respuesta del método.
   */
  call(methodPath: string, params?: any, body?: any): Observable<any> {
    const url = `${this.API_URL}/method/${methodPath}`;
    const headers = this.getHeaders();
    
    // Determinar si es GET o POST basado en si hay body
    if (body !== undefined) {
      // POST request
      return this.http.post<FrappeMessageResponse>(url, body, { headers })
        .pipe(
          map(response => response.message),
          catchError(this.handleError)
        );
    } else {
      // GET request
      let httpParams = new HttpParams();
      if (params) {
        Object.keys(params).forEach(key => {
          httpParams = httpParams.set(key, params[key]);
        });
      }
      
      return this.http.get<FrappeMessageResponse>(url, { headers, params: httpParams })
        .pipe(
          map(response => response.message),
          catchError(this.handleError)
        );
    }
  }
}