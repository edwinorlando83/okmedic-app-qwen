import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { FrappeApiService } from "./frappe-api.service";
import { MessageUtilsService } from "../utils/message-utils.service";
import { LugarAtencion } from "../interfaces/okm-atencion.interface";

@Injectable({
    providedIn: 'root'
})
export class AtencionService {

    constructor(
        private frappeApiService: FrappeApiService,
        private messageUtils: MessageUtilsService
    ) { }
    /**
 * Obtiene información combinada del paciente, atención y médico.
 * Llama al método whitelisted okmedic.apirest.atencionmedica.getInfoPacienteDoctor.
 * 
 * @param name_atencion El ID (name) del documento OKM_ATENCION.
 * @returns Un observable con los datos combinados.
 */
    getInfoPacienteDoctor(name_atencion: string): Observable<any> {
        const methodPath = 'okmedic.apirest.atencionmedica.getInfoPacienteDoctor';
        const args = { name_atencion }; // Argumentos para el método

        return this.frappeApiService.call(methodPath, {}, args) // args como body para POST
            .pipe(
                catchError((error: any) => {
                    console.error(`Error al obtener info paciente-doctor para ${name_atencion}:`, error);
                    this.messageUtils.mostrarErrorDeFrappe('Error al obtener información', error);
                    throw error;
                })
            );
    }


 getLugaresAtencion(): Observable<LugarAtencion[]> {
    return this.frappeApiService.list<LugarAtencion>('OKM_LUGARATENCION', {
      fields: ['name', 'lugate_desc'],
      orderBy: 'lugate_desc asc',
      limitPageLength: 1000
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener lugares de atención:', error);
        this.messageUtils.mostrarErrorDeFrappe('Error al obtener lugares de atención', error);
        return [[]];
      })
    );
  }


   /**
   * Obtiene una lista de registros de una tabla hija de un documento.
   * 
   * @param parentDoctype El nombre del DocType padre.
   * @param parentId El ID (name) del documento padre.
   * @param childTableFieldname El nombre del campo tabla hija en el padre.
   * @param childDoctype El nombre del DocType de la tabla hija.
   * @param options Opciones adicionales (fields, filters, etc.).
   * @returns Un observable con la lista de registros hijos.
   */
  getChildTableRecords<T>(
    parentDoctype: string,
    parentId: string,
    childTableFieldname: string,
    childDoctype: string,
    options: any = {}
  ): Observable<T[]> {
    // Para obtener registros de una tabla hija, normalmente se hace una llamada GET
    // al recurso padre y se solicitan los campos de la tabla hija.
    // Sin embargo, Frappe también permite listar directamente desde la tabla hija
    // usando filtros por 'parent' y 'parentfield'.
    
    const defaultOptions = {
      fields: ['*'], // Por defecto, obtener todos los campos
      filters: [
        ['parent', '=', parentId],
        ['parentfield', '=', childTableFieldname],
        ['parenttype', '=', parentDoctype]
      ],
      orderBy: 'idx asc', // Ordenar por índice
      limitPageLength: 1000
    };

    const finalOptions = { ...defaultOptions, ...options };

    return this.frappeApiService.list<T>(childDoctype, finalOptions)
      .pipe(
        catchError((error) => {
          console.error(`Error al obtener registros de ${childTableFieldname}:`, error);
          this.messageUtils.mostrarErrorDeFrappe(`Error al obtener ${childTableFieldname}`, error);
          return [[]];
        })
      );
  }

  /**
   * Crea un nuevo registro en una tabla hija.
   * 
   * @param childDoctype El nombre del DocType de la tabla hija.
   * @param data Los datos del registro hijo a crear, incluyendo parent, parentfield, parenttype.
   * @returns Un observable con el registro hijo creado.
   */
  createChildRecord<T>(childDoctype: string, data: Partial<T>): Observable<T> {
    return this.frappeApiService.create<T>(childDoctype, data)
      .pipe(
        catchError((error) => {
          console.error(`Error al crear registro en ${childDoctype}:`, error);
          this.messageUtils.mostrarErrorDeFrappe(`Error al crear registro`, error);
          throw error;
        })
      );
  }

  /**
   * Actualiza un registro existente en una tabla hija.
   * 
   * @param childDoctype El nombre del DocType de la tabla hija.
   * @param name El ID (name) del registro hijo.
   * @param data Los campos a actualizar.
   * @returns Un observable con el registro hijo actualizado.
   */
  updateChildRecord<T>(childDoctype: string, name: string, data: Partial<T>): Observable<T> {
    return this.frappeApiService.update<T>(childDoctype, name, data)
      .pipe(
        catchError((error) => {
          console.error(`Error al actualizar registro ${name} en ${childDoctype}:`, error);
          this.messageUtils.mostrarErrorDeFrappe(`Error al actualizar registro`, error);
          throw error;
        })
      );
  }

   
  

   getAtencionConTablasHijas(ate_id: string): Observable<any> {
    // Especificamos los campos que queremos obtener del padre y de las tablas hijas
    const fields = [
      '*', // Todos los campos del padre
      // Campos de las tablas hijas (usando notación de punto)
      'ate_antobstetricos.*',
      'ate_antginecologicos.*',
      'ate_aodontologicos.*',
      'infexaodo_informes.*',
      'pac_parientes.*',
      'pac_contactos.*',
      'pac_antpersonal.*',
      'pac_antquirurgicos.*',
      'pac_antaler.*',
      'pac_antfamiliares.*',
      'pac_habitos.*',
      'pac_vacunas.*',
      'pac_medicamentosactuales.*',
      'pac_examenesrealizados.*',
      'pac_antobstetricos.*',
      'pac_antginecologicos.*',
      'pac_aodontologicos.*',
      'infexaodo_informes.*',
      'pac_eventotrabajo.*',
      'pac_resexamenes.*',
      'pac_planfamiliar.*',
      'pac_consentimientos.*',
      'pac_aptotrabajo.*',
      'pac_evalretiro.*',
      'pac_condstrabajo.*'
    ];

    // Opciones para la llamada al API
    const options = {
      fields: fields
    };

    // Llamamos al método get del FrappeApiService  return this.frappeApiService.get<any>('OKM_ATENCION', ate_id, options)
    return this.frappeApiService.get2<any>('OKM_ATENCION', ate_id, options)
      .pipe(
        catchError((error) => {
          console.error(`Error al obtener atención ${ate_id} con tablas hijas:`, error);
          this.messageUtils.mostrarErrorDeFrappe(`Error al obtener atención ${ate_id}`, error);
          return of(null); // Devolvemos null en caso de error
        })
      );
  }

}