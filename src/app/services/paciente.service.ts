// src/app/paciente/services/paciente.service.ts
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
 
// Asegúrate de importar las interfaces que definimos anteriormente
import { 
  OKM_Paciente, 
  OKM_TipoIdentificacion, 
  OKM_Sexo, 
  OKM_EstadoCivil, 
  OKM_Pais 
  // ... (importa otras interfaces de datos maestros si las creaste)
} from '../interfaces/okm-paciente.interface'; // Ajusta la ruta según tu estructura
import { FrappeApiService } from './frappe-api.service';
import { MessageUtilsService } from '../utils/message-utils.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly DOCTYPE = 'OKM_PACIENTE';
  // private readonly DOCTYPE_DPA = 'OKM_DPA'; // Si existe y lo usas directamente

  constructor(
    private frappeApiService: FrappeApiService,
    private messageUtils: MessageUtilsService
  ) { }

  // --- CRUD Operations ---

  /**
   * Obtiene un paciente por su ID (name).
   * @param id El ID del paciente.
   * @returns Un observable con los datos del paciente.
   */
  getPaciente(id: string): Observable<OKM_Paciente | null> {
 
    return this.frappeApiService.get<OKM_Paciente>(this.DOCTYPE, id)
      .pipe(
        catchError((error) => {
          console.error(`Error al obtener paciente ${id}:`, error);
          this.messageUtils.mostrarErrorDeFrappe('Error al obtener paciente', error);
          return [null]; 
        })
      );
  }

  /**
   * Crea un nuevo paciente.
   * @param data Los datos del paciente a crear.
   * @returns Un observable con el paciente creado.
   */
  createPaciente(data: Partial<OKM_Paciente>): Observable<OKM_Paciente> {
    return this.frappeApiService.create<OKM_Paciente>(this.DOCTYPE, data)
      .pipe(
        catchError((error) => {
          console.error('Error al crear paciente:', error);
          this.messageUtils.mostrarErrorDeFrappe('Error al crear paciente', error);
          throw error; // Relanzar el error para que el componente lo maneje
        })
      );
  }

  /**
   * Actualiza un paciente existente.
   * @param id El ID del paciente a actualizar.
   * @param data Los campos a actualizar.
   * @returns Un observable con el paciente actualizado.
   */
  updatePaciente(id: string, data: Partial<OKM_Paciente>): Observable<OKM_Paciente> {
    return this.frappeApiService.update<OKM_Paciente>(this.DOCTYPE, id, data)
      .pipe(
        catchError((error) => {
          console.error(`Error al actualizar paciente ${id}:`, error);
          this.messageUtils.mostrarErrorDeFrappe('Error al actualizar paciente', error);
          throw error;
        })
      );
  }

  /**
   * Elimina un paciente.
   * @param id El ID del paciente a eliminar.
   * @returns Un observable que emite un mensaje de confirmación.
   */
  deletePaciente(id: string): Observable<any> {
    return this.frappeApiService.delete(this.DOCTYPE, id)
      .pipe(
        catchError((error) => {
          console.error(`Error al eliminar paciente ${id}:`, error);
          this.messageUtils.mostrarErrorDeFrappe('Error al eliminar paciente', error);
          throw error;
        })
      );
  }

  // --- Listado con Filtros ---

  /**
   * Obtiene una lista de pacientes con filtros opcionales.
   * @param filters Filtros para la búsqueda.
   * @param orderBy Campo y dirección para ordenar.
   * @param limitStart Índice de inicio para la paginación.
   * @param limitPageLength Número de registros por página.
   * @returns Un observable con la lista de pacientes.
   * Nota: Frappe no devuelve el total directamente en list. Se puede obtener con count separado si es necesario.
   */
  getPacientes(
    filters: any = {},
    orderBy: string = 'pac_papellido asc, pac_pnombre asc',
    limitStart: number = 0,
    limitPageLength: number = 20
  ): Observable<OKM_Paciente[]> {
    const options: any = {
      fields: [
        'name', 'pac_historiaclinica', 'pac_identificacion',
        'pac_pnombre', 'pac_snombre', 'pac_papellido', 'pac_sapellido',
        'pac_nombrecompleto', 'sex_codigo', 'pac_fechanac'
        // Añade otros campos que necesites mostrar en la lista
      ],
      filters,
      orderBy,
      limitStart,
      limitPageLength
    };

    return this.frappeApiService.list<OKM_Paciente>(this.DOCTYPE, options)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener lista de pacientes:', error);
          this.messageUtils.mostrarErrorDeFrappe('Error al obtener lista de pacientes', error);
          return [[]]; // Devolver un array vacío en caso de error
        })
      );
  }

  // --- Servicios para Datos Maestros ---

  /**
   * Obtiene la lista de tipos de identificación.
   * @returns Un observable con la lista.
   */
  getTiposIdentificacion(): Observable<OKM_TipoIdentificacion[]> {
    return this.frappeApiService.list<OKM_TipoIdentificacion>('OKM_TIPOIDENTIFICACION', {
      fields: ['name', 'tipide_desc'],
      orderBy: 'tipide_desc asc',
      limitPageLength: 1000
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener tipos de identificación:', error);
        this.messageUtils.mostrarErrorDeFrappe('Error al obtener tipos de identificación', error);
        return [[]];
      })
    );
  }

  /**
   * Obtiene la lista de sexos.
   * @returns Un observable con la lista.
   */
  getSexos(): Observable<OKM_Sexo[]> {
    return this.frappeApiService.list<OKM_Sexo>('OKM_SEXO', {
      fields: ['name', 'sex_desc'],
      orderBy: 'sex_desc asc',
      limitPageLength: 1000
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener sexos:', error);
        this.messageUtils.mostrarErrorDeFrappe('Error al obtener sexos', error);
        return [[]];
      })
    );
  }

  /**
   * Obtiene la lista de estados civiles.
   * @returns Un observable con la lista.
   */
  getEstadosCiviles(): Observable<OKM_EstadoCivil[]> {
    return this.frappeApiService.list<OKM_EstadoCivil>('OKM_ESTADOCIVIL', {
      fields: ['name', 'estciv_desc'],
      orderBy: 'estciv_desc asc',
      limitPageLength: 1000
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener estados civiles:', error);
        this.messageUtils.mostrarErrorDeFrappe('Error al obtener estados civiles', error);
        return [[]];
      })
    );
  }

  /**
   * Obtiene la lista de países.
   * @returns Un observable con la lista.
   */
  getPaises(): Observable<OKM_Pais[]> {
    return this.frappeApiService.list<OKM_Pais>('OKM_PAIS', {
      fields: ['name', 'pai_desc'],
      orderBy: 'pai_desc asc',
      limitPageLength: 1000
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener países:', error);
        this.messageUtils.mostrarErrorDeFrappe('Error al obtener países', error);
        return [[]];
      })
    );
  }

  // --- Servicios para Ubicaciones Geográficas ---
  // Basado en el script JS proporcionado, se usan métodos whitelisted

  /**
   * Obtiene la lista de provincias.
   * Llama a un método whitelisted en el backend.
   * @returns Un observable con la lista de nombres de provincias.
   */
  getProvincias(): Observable<string[]> {
    // Llamada al método whitelisted usando `call`
    // No pasamos `params` en el GET, los argumentos van en `body` para POST
    // o como parte de la URL/path/query params si es GET. 
    // Para simplificar, usaremos POST (body vacío si no hay args) o GET.
    // Dado que no hay parámetros complejos, un GET simple debería funcionar.
    // Si el método en el backend espera parámetros específicos, ajusta `args`.
    const args = {}; // Si el método necesita argumentos, pásalos aquí.
    
    return this.frappeApiService.call('okmedic.administracion.doctype.okm_dpa.okm_dpa.getProvincias', args) // args como body para POST
      .pipe(
        map((response: any) => {
          // Suponiendo que la respuesta es un array de arrays [[nombre1], [nombre2], ...]
          // o directamente un array de strings si el método lo devuelve así.
          // Ajusta según la estructura real de tu respuesta.
          if (response   ) {
            // Si es un array de arrays, extraemos el primer elemento
 
            return response;
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error al obtener provincias:', error);
          this.messageUtils.mostrarErrorDeFrappe('Error al obtener provincias', error);
          return [[]];
        })
      );
  }

  /**
   * Obtiene la lista de cantones para una provincia.
   * @param provincia El nombre de la provincia.
   * @returns Un observable con la lista de nombres de cantones.
   */
  getCantones(provincia: string): Observable<string[]> {
    const args = { dpa_provincia: provincia };
    return this.frappeApiService.call('okmedic.administracion.doctype.okm_dpa.okm_dpa.getCantones', args)
      .pipe(
        map((response: any) => {
          if (response ) {
          
            return response;
          }
          return [];
        }),
        catchError((error) => {
          console.error(`Error al obtener cantones para ${provincia}:`, error);
          this.messageUtils.mostrarErrorDeFrappe(`Error al obtener cantones para ${provincia}`, error);
          return [[]];
        })
      );
  }

  /**
   * Obtiene la lista de parroquias para una provincia y cantón.
   * @param provincia El nombre de la provincia.
   * @param canton El nombre del cantón.
   * @returns Un observable con la lista de nombres de parroquias.
   */
  getParroquias(provincia: string, canton: string): Observable<string[]> {
    const args = { dpa_provincia: provincia, dpa_canton: canton };
    return this.frappeApiService.call('okmedic.administracion.doctype.okm_dpa.okm_dpa.getParroquias', args)
      .pipe(
        map((response: any) => {
          if (response  ) {
             
            return response;
          }
          return [];
        }),
        catchError((error) => {
          console.error(`Error al obtener parroquias para ${provincia}/${canton}:`, error);
          this.messageUtils.mostrarErrorDeFrappe(`Error al obtener parroquias para ${provincia}/${canton}`, error);
          return [[]];
        })
      );
  }

  /**
   * Obtiene el código DPA para una provincia, cantón y parroquia.
   * @param provincia El nombre de la provincia.
   * @param canton El nombre del cantón.
   * @param parroquia El nombre de la parroquia.
   * @returns Un observable con el código DPA.
   */
  getDpaCode(provincia: string, canton: string, parroquia: string): Observable<string | null> {
    const args = { dpa_provincia: provincia, dpa_canton: canton, dpa_parroquia: parroquia };
    return this.frappeApiService.call('okmedic.administracion.doctype.okm_dpa.okm_dpa.getDpaCode', args)
      .pipe(
        map((response: any) => {
          if (response && response.message) {
            // Ajusta según la estructura real de la respuesta
            // Puede ser un string directamente o un array
            if (Array.isArray(response.message) && response.message.length > 0) {
                if(Array.isArray(response.message[0]) && response.message[0].length > 0){
                     return response.message[0][0] || null;
                }
                return response.message[0] || null;
            }
            return response.message || null;
          }
          return null;
        }),
        catchError((error) => {
          console.error(`Error al obtener código DPA para ${provincia}/${canton}/${parroquia}:`, error);
          this.messageUtils.mostrarErrorDeFrappe(`Error al obtener código DPA`, error);
          return [null];
        })
      );
  }

  // --- Servicios para Cargar Datos por Cédula ---
  // Basado en el script JS proporcionado

  /**
   * Obtiene datos del paciente a partir de la cédula.
   * Llama a un método whitelisted en el backend.
   * @param identificacion El número de identificación.
   * @returns Un observable con los datos obtenidos.
   */
  getDataByIdentification(identificacion: string): Observable<any> {
    const args = { identificacion };
    return this.frappeApiService.call('okmedic.externos.freecedulas.get_cedula', args)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener datos por identificación:', error);
          // Este error puede ser común si la cédula no se encuentra, 
          // por lo que podrías no querer mostrar un mensaje de error al usuario.
          // this.messageUtils.mostrarErrorDeFrappe('Error al obtener datos del paciente', error);
          throw error; // Relanzamos para que el componente decida
        })
      );
  }

    getLateralidades(): Observable<{ lat_codigo: string; lat_desc: string }[]> { // Tipado explícito
    return this.frappeApiService.list<{ lat_codigo: string; lat_desc: string }>('OKM_LATERALIDAD', {
      fields: ['lat_codigo', 'lat_desc'],
      orderBy: 'lat_desc asc', // O 'lat_codigo asc' si prefieres ordenar por código
      limitPageLength: 1000
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener lateralidades:', error);
        this.messageUtils.mostrarErrorDeFrappe('Error al obtener lateralidades', error);
        return [[]];
      })
    );
  }

  
}
