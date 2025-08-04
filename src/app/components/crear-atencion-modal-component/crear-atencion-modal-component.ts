// src/app/agenda/crear-atencion-modal/crear-atencion-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrappeApiService } from '../../services/frappe-api.service';
import { MessageUtilsService } from '../../utils/message-utils.service';
import { finalize } from 'rxjs/operators';

// Definir interfaces para los items de los catálogos
interface ItemCatalogo {
  name: string; // Este será el código (tipate_codigo, cro_codigo, lugate_codigo)
  [key: string]: string; // Para acceder dinámicamente a la descripción (tipate_desc, etc.)
}

@Component({
  selector: 'app-crear-atencion-modal',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './crear-atencion-modal-component.html',
  styleUrls: ['./crear-atencion-modal-component.css']
})
export class CrearAtencionModalComponent implements OnInit {
  @Input() agendaName: string = ''; // Recibimos el nombre de la agenda/cita

  // Modelos para los selects (valores seleccionados)
  tipoAtencionSeleccionado: string = '';
  cronologiaSeleccionada: string = '';
  lugarAtencionSeleccionado: string = '';

  // Datos para los combos
  tiposAtencion: any[] = [];
  cronologias: any[] = [];
  lugaresAtencion: any[] = [];

  // Estados de carga y error
  cargandoCatalogos = true;
  errorCatalogos = '';
  enviando = false;


  
  constructor(
    public activeModal: NgbActiveModal,
    private frappeApiService: FrappeApiService,
    private messageUtils: MessageUtilsService
  ) { }

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  private cargarCatalogos(): void {
  this.cargandoCatalogos = true;
  this.errorCatalogos = '';

  // Cargar los tres catálogos en paralelo
  Promise.all([
    // 1. Cargar Tipos de Atención
    this.frappeApiService.list<ItemCatalogo>('OKM_TIPOATENCION', {
      fields: ['name', 'tipate_desc'],
      limitPageLength: 1000
    }).toPromise(),

    // 2. Cargar Cronologías
    this.frappeApiService.list<ItemCatalogo>('OKM_CRONOLOGIA', {
      fields: ['name', 'cro_desc'],
      limitPageLength: 1000
    }).toPromise(),

    // 3. Cargar Lugares de Atención
    this.frappeApiService.list<ItemCatalogo>('OKM_LUGARATENCION', {
      fields: ['name', 'lugate_desc'],
      limitPageLength: 1000
    }).toPromise()
  ])
  .then(([tipos, cronos, lugares]) => { // <- Los nombres 'tipos', 'cronos', 'lugares' son de tipo ItemCatalogo[]
    // CORRECCIÓN: Acceder directamente al arreglo, no a .data
    this.tiposAtencion = tipos ?? [];
    this.cronologias = cronos ?? [];
    this.lugaresAtencion = lugares ?? [];
    this.cargandoCatalogos = false;
  })
  .catch((error) => {
    console.error('Error al cargar catálogos:', error);
    this.errorCatalogos = 'Error al cargar los catálogos. Por favor, inténtelo de nuevo.';
    this.cargandoCatalogos = false;
    // Manejo de errores...
  });
}

  /**
   * Método llamado al hacer clic en el botón "Crear Atención".
   */
  crearAtencion(): void {
    // 1. Validación de campos obligatorios
    if (!this.tipoAtencionSeleccionado || !this.cronologiaSeleccionada || !this.lugarAtencionSeleccionado) {
      this.messageUtils.mostrarAdvertencia('Campos incompletos', 'Por favor, seleccione un valor en todos los campos.');
      return;
    }

    // 2. Confirmación (opcional)
    this.messageUtils.mostrarConfirmacion(
      '¿Crear atención?',
      '¿Está seguro de que desea crear una nueva atención con los datos seleccionados?',
      'Sí, crear',
      'Cancelar'
    ).then((confirmado) => {
      if (confirmado) {
        this.procederConCreacion();
      }
    });
  }

  private procederConCreacion(): void {
    // 1. Mostrar indicador de carga
    this.enviando = true;
    this.messageUtils.mostrarCargando('Creando atención...');

    // 2. Preparar argumentos para el método whitelisted
    const args = {
      name_agenda: this.agendaName,
      cro_codigo: this.cronologiaSeleccionada,
      tipate_codigo: this.tipoAtencionSeleccionado,
      lugate_codigo: this.lugarAtencionSeleccionado
    };

    // 3. Llamar al método whitelisted de Frappe
    this.frappeApiService.call('okmedic.servicios.agenda.crearAtencion', {}, args)
      .pipe(
        finalize(() => {
          // Cerrar el indicador de carga cuando termine (éxito o error)
          this.messageUtils.cerrar();
          this.enviando = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Atención creada exitosamente:', response);
          this.messageUtils.mostrarExito('Atención creada', response.message);
          // Cerrar el modal y devolver éxito
          this.activeModal.close({ success: true, data: response });
        },
        error: (error) => {
          console.error('Error al crear atención:', error);
          this.messageUtils.mostrarErrorDeFrappe('Error al crear atención', error);
        }
      });
  }


  
  /**
   * Cierra el modal sin crear atención.
   */
  cancelar(): void {
    this.activeModal.dismiss({ reason: 'cancelado' });
  }
}