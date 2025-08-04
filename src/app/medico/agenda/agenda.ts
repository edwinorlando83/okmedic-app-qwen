// src/app/agenda/agenda.component.ts
import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common'; // Para [ngClass]
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { AgendaService } from '../../services/agenda.service';
import { FrappeApiService } from '../../services/frappe-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PacienteSelectorModalComponent } from '../../components/paciente-selector.component/paciente-selector.component';
import { MessageUtilsService } from '../../utils/message-utils.service';
import { CitaDisponible, CitaEnCurso, CitaProgramada, Paciente } from '../../interfaces/interfaces';
import { CrearAtencionModalComponent } from '../../components/crear-atencion-modal-component/crear-atencion-modal-component';
 
@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, NgFor,   

  ],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css']
})
export class AgendaComponent {
  activeTab = 'disponibles'; // Pestaña activa por defecto
  selectedDate = new Date().toISOString().split('T')[0]; // Fecha de hoy

  // Datos para la pestaña "Agendas Disponibles"
  atiende: 'SI' | 'NO' = 'SI'; // Valor por defecto
  numeroCitas = 0;
  citasDisponibles: CitaDisponible[] = [];
  cargandoAgenda = false;
  errorAgenda = '';
  citaSeleccionadaParaAsignar: CitaDisponible | null = null;

    // Datos para la pestaña "Citas Programadas"
  citasProgramadas: CitaProgramada[] = [];
  cargandoCitasProgramadas = false;
  errorCitasProgramadas = '';

// Datos para la pestaña "Citas en Curso"
  citasEnCurso: CitaEnCurso[] = [];
  cargandoCitasEnCurso = false;
  errorCitasEnCurso = '';

// Datos para la pestaña "Citas Completadas"
  citasCompletadas: CitaEnCurso[] = []; // Reutilizo CitaEnCurso
  cargandoCitasCompletadas = false;
  errorCitasCompletadas = '';



  constructor(

    private authService: AuthService,
    private agendaService: AgendaService,
    private frappeApiService: FrappeApiService,
    private modalService: NgbModal,
      private messageUtils: MessageUtilsService 
      
  ) { }

  ngOnInit(): void {
    this.cargarAgendaDisponible(); // ✅ Cargar al iniciar
 

  }
 
 setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'disponibles') {
      this.cargarAgendaDisponible(); // ✅ Recargar si se vuelve a la pestaña
    } else if (tab === 'programadas') {
      this.cargarCitasProgramadas();
    } else if (tab === 'curso') {
       this.cargarCitasEnCurso();
    }else if (tab === 'completadas') {
       this.cargarCitasCompletadas();
    }
    // Puedes añadir lógica para otras pestañas aquí
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    console.log('Fecha seleccionada:', this.selectedDate);
    if (this.activeTab === 'disponibles') {
      this.cargarAgendaDisponible(); // ✅ Recargar al cambiar fecha en la pestaña correcta
    }
  }

  private cargarAgendaDisponible(): void {
    this.cargandoAgenda = true;
    this.errorAgenda = '';

    const idProfesional = this.authService.getProfesionalId();
    const codigoUnidad = this.authService.getUnidadMedicaCodigo();

    if (!idProfesional || !codigoUnidad) {
      this.errorAgenda = 'No se encontraron datos del profesional o unidad médica. Por favor, inicie sesión nuevamente.';
      this.cargandoAgenda = false;
      return;
    }

    this.agendaService.getAgendaDoctor(
      idProfesional,
      codigoUnidad,
      this.selectedDate
    ).subscribe({
      next: (response) => {
        console.log('Respuesta de agenda:', response);
        this.atiende = response.message.atiende;
        this.numeroCitas = response.message.numero_citas;
        this.citasDisponibles = response.message.citas || [];
        this.cargandoAgenda = false;
      },
      error: (err) => {
        console.error('Error al cargar la agenda:', err);
        this.errorAgenda = 'Error al cargar la agenda. Por favor, intente nuevamente.';
        this.cargandoAgenda = false;
        this.atiende = 'SI'; // Resetear valores
        this.numeroCitas = 0;
        this.citasDisponibles = [];
      }
    });
  }

  /**
   * Método llamado cuando se hace clic en "Asignar Cita" para una cita específica.
   * Almacena la cita y abre el selector de pacientes.
   */
  asignarCita(cita: CitaDisponible): void {
    console.log('Preparando para asignar cita:', cita.name);
    // 1. Guardar la cita seleccionada
    this.citaSeleccionadaParaAsignar = cita;
    // 2. Abrir el selector de pacientes
    this.abrirSelectorPacientes();
  }


  ajustarBrilloColor(color: string, porcentaje: number): string {
    if (!color || !color.startsWith('#')) return color;

    // Convertir hex a RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Ajustar brillo
    r = Math.min(255, Math.max(0, r + porcentaje));
    g = Math.min(255, Math.max(0, g + porcentaje));
    b = Math.min(255, Math.max(0, b + porcentaje));

    // Convertir de vuelta a hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Función auxiliar para determinar si el texto debe ser negro
  necesitaTextoNegro(color: string): boolean {
    if (!color || !color.startsWith('#')) return false;

    // Convertir hex a RGB
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    // Calcular luminosidad
    const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminosidad > 0.7;
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  /**
   * Abre el modal para seleccionar un paciente.
   */
  abrirSelectorPacientes(): void {
    // Verificar si hay una cita seleccionada antes de abrir el modal
    if (!this.citaSeleccionadaParaAsignar) {
      console.warn('No hay cita seleccionada para asignar.');
      return;
    }

    const modalRef = this.modalService.open(PacienteSelectorModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.result.then(
      (pacienteSeleccionado: Paciente) => {
        console.log('Paciente seleccionado:', pacienteSeleccionado);
        // 3. Llamar al método que asigna la cita con el paciente y la cita guardada
        this.asignarPacienteACita(pacienteSeleccionado, this.citaSeleccionadaParaAsignar!);
        // 4. Limpiar la cita seleccionada
        this.citaSeleccionadaParaAsignar = null;
      },
      (dismissedReason) => {
        console.log('Modal cerrado sin seleccionar paciente:', dismissedReason);
        // Limpiar la cita seleccionada si se cierra el modal
        this.citaSeleccionadaParaAsignar = null;
      }
    );
  }

  /**
   * Llama al servicio de Frappe para asignar un paciente a una cita.
   */
   private asignarPacienteACita(paciente: Paciente, cita: CitaDisponible): void {
  // ✅ Mostrar mensaje de carga
  this.messageUtils.mostrarCargando('Asignando paciente a la cita...');

  // Llamar al método whitelisted de Frappe usando FrappeApiService
  this.frappeApiService.call(
    'okmedic.servicios.agenda.asignarPaciente',
    {}, // No hay parámetros GET
    {  // Parámetros POST (body)
      okm_agenda_name: cita.name,
      okm_paciente_name: paciente.name
    }
  ).subscribe({
    next: (response) => {
      // ✅ Cerrar mensaje de carga y mostrar éxito
      this.messageUtils.cerrar();
      console.log('Asignación exitosa:', response);
      // ✅ Usar mensaje de éxito
      this.messageUtils.mostrarExito('Paciente asignado', response.message || `Paciente ${paciente.pac_nombrecompleto} asignado correctamente a la cita ${cita.name}.`);
      
      // Opcional: Recargar la lista de citas disponibles para reflejar el cambio
      this.cargarAgendaDisponible();
    },
    error: (error) => {   
      this.messageUtils.cerrar();
      console.error('Error al asignar paciente:', error);     
 
      this.messageUtils.mostrarErrorDeFrappe('Error en asignación', error);
    }
  });
}

  private cargarCitasProgramadas(): void {
    // Solo cargar si no se han cargado ya o si se necesita recargar
    if (this.citasProgramadas.length > 0) {
        return; // O puedes implementar una lógica de refresco si es necesario
    }

    this.cargandoCitasProgramadas = true;
    this.errorCitasProgramadas = '';

    const idProfesional = this.authService.getProfesionalId();
    const codigoUnidad = this.authService.getUnidadMedicaCodigo();

    if (!idProfesional || !codigoUnidad) {
      this.errorCitasProgramadas = 'No se encontraron datos del profesional o unidad médica. Por favor, inicie sesión nuevamente.';
      this.cargandoCitasProgramadas = false;
      this.messageUtils.mostrarError('Error de Autenticación', this.errorCitasProgramadas);
      return;
    }

    this.agendaService.getCitasProgramadas(idProfesional, codigoUnidad).subscribe({
      next: (response) => {
        this.citasProgramadas = response.message || [];
        this.cargandoCitasProgramadas = false;
        console.log('Citas programadas cargadas:', this.citasProgramadas);
      },
      error: (err) => {
        console.error('Error al cargar citas programadas:', err);
        this.errorCitasProgramadas = 'Error al cargar las citas programadas. Por favor, intente nuevamente.';
        this.cargandoCitasProgramadas = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar citas', err);
      }
    });
  }


  /**
   * Método para cancelar una cita programada.
   * Muestra una confirmación y luego llama al servicio.
   */
  cancelarCita(cita: CitaProgramada): void {
    // 1. Mostrar confirmación usando MessageUtilsService
    this.messageUtils.mostrarConfirmacion(
      '¿Cancelar cita?',
      `¿Está seguro de que desea cancelar la cita de <strong>${cita.pac_nombrecompleto}</strong> para el ${cita.age_fechacita} a las ${cita.age_hinicio}?`,
      'Sí, cancelar',
      'No, mantener'
    ).then((resultado) => {
      if (resultado) {
        // 2. Si el usuario confirma, proceder con la cancelación
        this.procederConCancelacion(cita);
      }
    });
  }

  private procederConCancelacion(cita: CitaProgramada): void {
    // 1. Mostrar mensaje de carga
    this.messageUtils.mostrarCargando('Cancelando cita...');

    // 2. Llamar al servicio
    this.agendaService.cancelarAsignacion(cita.name).subscribe({
      next: (response) => {
        // 3. Cerrar carga y mostrar éxito
        this.messageUtils.cerrar();
        this.messageUtils.mostrarExito('Cita cancelada', response.message);
        
        // 4. Opcional: Recargar la lista de citas programadas
        // Limpiamos la lista para forzar una recarga
        this.citasProgramadas = []; 
        if (this.activeTab === 'programadas') {
            this.cargarCitasProgramadas(); // Solo recargar si estamos en la pestaña correcta
        }
        // O si prefieres recargar inmediatamente sin limpiar:
        // this.cargarCitasProgramadas();
      },
      error: (err) => {
        // 3. Cerrar carga y mostrar error
        this.messageUtils.cerrar();
        this.messageUtils.mostrarErrorDeFrappe('Error al cancelar', err);
      }
    });
  }



/**
   * Método para abrir el modal de crear atención.
   * @param citaName El nombre (ID) de la cita para la cual se creará la atención.
   */
  abrirModalCrearAtencion(citaName: string): void {
    const modalRef = this.modalService.open(CrearAtencionModalComponent, {
      size: 'lg', // Tamaño grande
      backdrop: 'static', // Evita cerrar haciendo clic fuera
      keyboard: false // Evita cerrar con ESC
    });

    // Pasar el nombre de la cita al modal
    modalRef.componentInstance.agendaName = citaName;

    // Manejar el resultado del modal (opcional)
    modalRef.result.then(
      (resultado: { success: boolean; data: any }) => {
        if (resultado?.success) {
          console.log('Atención creada exitosamente, datos:', resultado.data);
          // Aquí puedes recargar la lista de citas, cambiar de pestaña, etc.
          // Ejemplo: recargar citas programadas si estás en esa pestaña
          if (this.activeTab === 'programadas') {
             // Limpiar y recargar
             this.citasProgramadas = [];
             this.cargarCitasProgramadas();
          }
        }
      },
      (dismissedReason) => {
        console.log('Modal de crear atención cerrado:', dismissedReason);
        // Opcional: manejar el cierre sin acción
      }
    );
  }

 private cargarCitasEnCurso(): void {
    // Solo cargar si no se han cargado ya o si se necesita recargar
    if (this.citasEnCurso.length > 0) {
        return; // O puedes implementar una lógica de refresco si es necesario
    }

    this.cargandoCitasEnCurso = true;
    this.errorCitasEnCurso = '';

    const idProfesional = this.authService.getProfesionalId();
    const codigoUnidad = this.authService.getUnidadMedicaCodigo();

    if (!idProfesional || !codigoUnidad) {
      this.errorCitasEnCurso = 'No se encontraron datos del profesional o unidad médica. Por favor, inicie sesión nuevamente.';
      this.cargandoCitasEnCurso = false;
      this.messageUtils.mostrarError('Error de Autenticación', this.errorCitasEnCurso);
      return;
    }

    // Llamar al nuevo método del servicio
    // Nota: Pasamos "null" como string para okm_profsalud_name según el ejemplo del servicio
    this.agendaService.getAtencionesEnProceso(null, codigoUnidad).subscribe({
      next: (response:any) => {
        this.citasEnCurso = response.message || [];
        this.cargandoCitasEnCurso = false;
        console.log('Citas en curso cargadas:', this.citasEnCurso);
      },
      error: (err:any) => {
        console.error('Error al cargar citas en curso:', err);
        this.errorCitasEnCurso = 'Error al cargar las citas en curso. Por favor, intente nuevamente.';
        this.cargandoCitasEnCurso = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar citas en curso', err);
      }
    });
  }


  /**
   * Método para ir a la atención (por ejemplo, redirigir a otra página).
   * @param cita La cita en curso.
   */
  irAAtencion(cita: CitaEnCurso): void {
    console.log('Ir a atención para:', cita.atencion_name);
    // Aquí puedes implementar la navegación real, por ejemplo:
    // this.router.navigate(['/atencion-medica', cita.atencion_name]);
    // O abrir un modal, etc.
    alert(`Funcionalidad para ir a la atención ${cita.atencion_name} aún no implementada.`);
  }

private cargarCitasCompletadas(): void {
    // Solo cargar si no se han cargado ya
    if (this.citasCompletadas.length > 0) {
        return;
    }

    this.cargandoCitasCompletadas = true;
    this.errorCitasCompletadas = '';

    const idProfesional = this.authService.getProfesionalId();
    const codigoUnidad = this.authService.getUnidadMedicaCodigo();

    if (!idProfesional || !codigoUnidad) {
      this.errorCitasCompletadas = 'No se encontraron datos del profesional o unidad médica. Por favor, inicie sesión nuevamente.';
      this.cargandoCitasCompletadas = false;
      this.messageUtils.mostrarError('Error de Autenticación', this.errorCitasCompletadas);
      return;
    }

    // Llamar al nuevo método del servicio
    this.agendaService.getAtencionesFinalizadas(idProfesional, codigoUnidad).subscribe({
      next: (response) => {
        this.citasCompletadas = response.message || [];
        this.cargandoCitasCompletadas = false;
        console.log('Citas completadas cargadas:', this.citasCompletadas);
      },
      error: (err) => {
        console.error('Error al cargar citas completadas:', err);
        this.errorCitasCompletadas = 'Error al cargar las citas completadas. Por favor, intente nuevamente.';
        this.cargandoCitasCompletadas = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar citas completadas', err);
      }
    });
  }

  /**
   * Método para ver la ficha/detalle de una cita completada.
   * @param cita La cita completada.
   */
  verFicha(cita: CitaEnCurso): void {
    console.log('Ver ficha para:', cita.atencion_name);
    // Aquí puedes implementar la navegación real, por ejemplo:
    // this.router.navigate(['/ficha-medica', cita.atencion_name]);
    // O abrir un modal con los detalles, etc.
    alert(`Funcionalidad para ver la ficha ${cita.atencion_name} aún no implementada.`);
  }
}