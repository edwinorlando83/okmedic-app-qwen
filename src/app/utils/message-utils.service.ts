// src/app/utils/message-utils.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
 
@Injectable({
  providedIn: 'root'
})
export class MessageUtilsService {

  constructor() { }

  // --- Mensajes de Éxito ---
  mostrarExito(titulo: string = '¡Éxito!', mensaje: string = 'Operación completada correctamente.'): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0077b6', // Color primario de OK-MEDIC
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    });
  }

  // --- Mensajes de Error ---
  mostrarError(titulo: string = '¡Error!', mensaje: string = 'Ha ocurrido un error. Por favor, inténtelo de nuevo.'): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545', // Color de error de Bootstrap
      customClass: {
        confirmButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
  }

  // --- Mensajes de Advertencia ---
  mostrarAdvertencia(titulo: string = 'Advertencia', mensaje: string): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#ffc107', // Color de advertencia de Bootstrap
      customClass: {
        confirmButton: 'btn btn-warning'
      },
      buttonsStyling: false
    });
  }

  // --- Mensajes de Información ---
  mostrarInfo(titulo: string = 'Información', mensaje: string): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'info',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#17a2b8', // Color de info de Bootstrap
      customClass: {
        confirmButton: 'btn btn-info'
      },
      buttonsStyling: false
    });
  }

  // --- Confirmación ---
  mostrarConfirmacion(
    titulo: string = '¿Está seguro?',
    mensaje: string = 'Esta acción no se puede deshacer.',
    textoConfirmar: string = 'Sí, continuar',
    textoCancelar: string = 'Cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: textoConfirmar,
      cancelButtonText: textoCancelar,
      confirmButtonColor: '#0077b6',
      cancelButtonColor: '#6c757d',
      customClass: {
        confirmButton: 'btn btn-primary me-2',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  // --- Mensaje de Carga (para operaciones largas) ---
  mostrarCargando(mensaje: string = 'Procesando...'): void {
    Swal.fire({
      title: mensaje,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // --- Cerrar cualquier SweetAlert abierto ---
  cerrar(): void {
    Swal.close();
  }

  // --- Mensaje de Éxito con Auto-cierre ---
  mostrarExitoAutoClose(titulo: string = '¡Éxito!', mensaje: string = 'Operación completada.', segundos: number = 3): void {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      timer: segundos * 1000,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        popup: 'swal2-popup-custom'
      }
    });
  }



  procesarErrorFrappe(error: any): string {
    console.log("Error recibido para procesar:", JSON.stringify(error)); // Para depuración

    let mensajeError = 'Error desconocido al comunicarse con el servidor.';

    try {
      // Caso 1: Frappe devuelve un ValidationError en '_server_messages'
      if (error.error?._server_messages) {
        // _server_messages es un string JSON que contiene una lista de mensajes serializados
        const serverMessages: string[] = JSON.parse(error.error._server_messages);
        if (Array.isArray(serverMessages) && serverMessages.length > 0) {
          // Tomar el primer mensaje
          let msg = serverMessages[0];
          if (typeof msg === 'string') {
            try {
              // A veces los mensajes internos también están serializados como JSON
              const parsedMsg = JSON.parse(msg);
              if (parsedMsg.message) {
                mensajeError = parsedMsg.message;
              } else {
                mensajeError = msg; // Usar el string interno si no tiene 'message'
              }
            } catch (innerError) {
              // Si no se puede parsear el mensaje interno, usar el string original
              mensajeError = msg;
            }
          } else if (typeof msg === 'object' && msg !== null && (msg as any).message) {
            // Si msg ya es un objeto con 'message'
            mensajeError = (msg as any).message;
          }
        }
      }
      // Caso 2: El mensaje está directamente en error.error.message
      else if (error.error?.message) {
        mensajeError = error.error.message;
      }
      // Caso 3: El mensaje está en error.message
      else if (error.message) {
        mensajeError = error.message;
      }
      // Caso 4: A veces error.error es un string con el mensaje
      else if (typeof error.error === 'string') {
        mensajeError = error.error;
      }
      // Caso 5: Errores de red o HTTP
      else if (error.status === 0) {
        mensajeError = 'Error de conexión. Verifique su red.';
      } else if (error.status === 401) {
        mensajeError = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
        // Opcional: redirigir al login
        // window.location.href = '/login';
      } else if (error.status === 403) {
        mensajeError = 'Acceso denegado. No tiene permisos para realizar esta acción.';
      } else if (error.status >= 500) {
        mensajeError = 'Error interno del servidor. Intente nuevamente más tarde.';
      }
      // Si ninguna de las condiciones anteriores se cumple, se mantiene el mensaje genérico inicial
    } catch (e) {
      // Si ocurre un error al intentar parsear el mensaje de error, mostramos uno genérico
      console.error("Error al procesar el mensaje de error del servidor Frappe:", e);
      mensajeError = "Ocurrió un error inesperado al procesar la respuesta del servidor.";
    }

    return mensajeError;
  }

  /**
   * Muestra un mensaje de error, procesando primero errores de Frappe si es necesario.
   * @param titulo El título del mensaje.
   * @param error El objeto de error o un string de mensaje.
   */
  mostrarErrorDeFrappe(titulo: string = '¡Error!', error: any): void {
    const mensajeLegible = this.procesarErrorFrappe(error);
    this.mostrarError(titulo, mensajeLegible);
  }
  
}