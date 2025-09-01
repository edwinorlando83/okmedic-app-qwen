import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OKM_ConsentimientoAm } from '../../../interfaces/okm-consentimientoam.interface';
import { AtencionService } from '../../../services/atencion.service';
import { MessageUtilsService } from '../../../utils/message-utils.service';

@Component({
 selector: 'app-detalle-atencion-consentimiento',

  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './detalle-atencion-consentimiento.html',
   styleUrl: './detalle-atencion-consentimiento.css'

})
export class DetalleAtencionConsentimiento implements OnInit {
  @Input() ate_id: string = '';

  // Datos de consentimientos
  consentimientos: OKM_ConsentimientoAm[] = [];
  cargandoConsentimientos = false;
  errorConsentimientos = '';
  modoEdicion = false;

  // Tipos de consentimiento disponibles
  tiposConsentimiento: any[] = [];

  // Formulario para nuevo consentimiento
  nuevoConsentimiento: OKM_ConsentimientoAm = {
    conam_fecha: new Date().toISOString().split('T')[0],
    conam_contestigo: 'NO'
  };

  // Para firma digital
  firmaPaciente: string | null = null;
  firmaTestigo: string | null = null;
  mostrarFirmaPaciente: boolean = false;
  mostrarFirmaTestigo: boolean = false;
  firmaPacienteCanvas: any = null;
  firmaTestigoCanvas: any = null;
  firmaPacienteContext: any = null;
  firmaTestigoContext: any = null;
  firmaPacienteDrawing: boolean = false;
  firmaTestigoDrawing: boolean = false;

  @ViewChild('firmaPacienteCanvas', { static: true }) firmaPacienteCanvasRef!: ElementRef;
  @ViewChild('firmaTestigoCanvas', { static: true }) firmaTestigoCanvasRef!: ElementRef;

  constructor(
    private authService: AtencionService,
    private messageUtils: MessageUtilsService
  ) { }

  ngOnInit(): void {
    if (this.ate_id) {
      this.cargarConsentimientos();
      this.cargarTiposConsentimiento();
    } else {
      console.error('No se proporcionó el ID de atención (ate_id)');
      this.messageUtils.mostrarError('Error', 'No se proporcionó el ID de atención.');
    }
  }

  ngAfterViewInit(): void {
    this.inicializarCanvasFirma();
  }

  private inicializarCanvasFirma(): void {
    // Inicializar canvas para firma del paciente
    if (this.firmaPacienteCanvasRef) {
      this.firmaPacienteCanvas = this.firmaPacienteCanvasRef.nativeElement;
      this.firmaPacienteContext = this.firmaPacienteCanvas.getContext('2d');
      this.configurarCanvas(this.firmaPacienteCanvas, this.firmaPacienteContext);
    }

    // Inicializar canvas para firma del testigo
    if (this.firmaTestigoCanvasRef) {
      this.firmaTestigoCanvas = this.firmaTestigoCanvasRef.nativeElement;
      this.firmaTestigoContext = this.firmaTestigoCanvas.getContext('2d');
      this.configurarCanvas(this.firmaTestigoCanvas, this.firmaTestigoContext);
    }
  }

  private configurarCanvas(canvas: any, context: any): void {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    
    // Establecer fondo blanco
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  private cargarTiposConsentimiento(): void {
    // Esta sería una llamada real al servicio para cargar tipos de consentimiento
    // Por ahora usamos datos de ejemplo basados en la definición del doctype
    this.tiposConsentimiento = [
      { tipcon_codigo: 'TRATAMIENTO', tipcon_desc: 'Consentimiento para Tratamiento Médico' },
      { tipcon_codigo: 'PROCEDIMIENTO', tipcon_desc: 'Consentimiento para Procedimiento' },
      { tipcon_codigo: 'INVESTIGACION', tipcon_desc: 'Consentimiento para Investigación' },
      { tipcon_codigo: 'TRANSPARENTE', tipcon_desc: 'Consentimiento Transparente' },
      { tipcon_codigo: 'ESPECIFICO', tipcon_desc: 'Consentimiento Específico' },
      { tipcon_codigo: 'DONACION', tipcon_desc: 'Consentimiento para Donación' },
      { tipcon_codigo: 'QUIMIOTERAPEUTICO', tipcon_desc: 'Consentimiento Quimioterapéutico' },
      { tipcon_codigo: 'RADIOTERAPIA', tipcon_desc: 'Consentimiento Radioterapia' }
    ];
  }

  private cargarConsentimientos(): void {
    this.cargandoConsentimientos = true;
    this.errorConsentimientos = '';

    // Filtrar por ate_id usando el método getChildTableRecords
    this.authService.getChildTableRecords<OKM_ConsentimientoAm>(
      'OKM_ATENCION',
      this.ate_id,
      'ate_consentimiento', // Campo en OKM_ATENCION que contiene la tabla hija
      'OKM_CONSENTIMIENTOAM'
    ).subscribe({
      next: (data) => {
        this.consentimientos = data;
        this.cargandoConsentimientos = false;
      },
      error: (err) => {
        console.error('Error al cargar consentimientos:', err);
        this.errorConsentimientos = 'Error al cargar consentimientos.';
        this.cargandoConsentimientos = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar consentimientos', err);
      }
    });
  }

  // Método para agregar un nuevo consentimiento
  agregarConsentimiento(): void {
    // Validar que se haya seleccionado un tipo de consentimiento
    if (!this.nuevoConsentimiento.tipcon_codigo) {
      this.messageUtils.mostrarError('Error', 'Debe seleccionar un tipo de consentimiento');
      return;
    }

    // Crear nuevo consentimiento con los datos del formulario
    const nuevoConsentimiento: OKM_ConsentimientoAm = {
      ...this.nuevoConsentimiento,
      parent: this.ate_id,
      parentfield: 'ate_consentimiento',
      parenttype: 'OKM_ATENCION'
    };

    // Crear en el backend
    this.authService.createChildRecord<OKM_ConsentimientoAm>(
      'OKM_CONSENTIMIENTOAM',
      nuevoConsentimiento
    ).subscribe({
      next: (created) => {
        this.messageUtils.mostrarExito('Consentimiento creado', 'El consentimiento se ha creado correctamente.');
        this.cargarConsentimientos(); // Recargar para reflejar cambios
        
        // Resetear formulario
        this.nuevoConsentimiento = {
          conam_fecha: new Date().toISOString().split('T')[0],
          conam_contestigo: 'NO'
        };
      },
      error: (err) => {
        this.messageUtils.mostrarErrorDeFrappe('Error al crear consentimiento', err);
      }
    });
  }

  // Método para eliminar un consentimiento
  eliminarConsentimiento(consentimiento: OKM_ConsentimientoAm): void {
    this.messageUtils.mostrarConfirmacion(
      '¿Eliminar consentimiento?',
      `¿Está seguro de que desea eliminar este consentimiento?`,
      'Sí, eliminar',
      'Cancelar'
    ).then(confirmado => {
      if (confirmado) {

     /*   this.authService.deleteChildRecord('OKM_CONSENTIMIENTOAM', consentimiento.name!).subscribe({
          next: () => {
            this.messageUtils.mostrarExito('Consentimiento eliminado', 'El consentimiento se ha eliminado correctamente.');
            this.cargarConsentimientos();
          },
          error: (err) => {
            this.messageUtils.mostrarErrorDeFrappe('Error al eliminar', err);
          }
        });

*/
      }
    });
  }

  // Método para abrir firma digital (con canvas)
  abrirFirma(consentimiento: OKM_ConsentimientoAm, tipoFirma: 'paciente' | 'testigo'): void {
    if (tipoFirma === 'paciente') {
      this.mostrarFirmaPaciente = true;
      this.firmaPaciente = null;
      setTimeout(() => {
        this.inicializarCanvasFirma();
      }, 100);
    } else {
      this.mostrarFirmaTestigo = true;
      this.firmaTestigo = null;
      setTimeout(() => {
        this.inicializarCanvasFirma();
      }, 100);
    }
  }

  // Métodos para manejar eventos del canvas de firma
  comenzarDibujo(event: MouseEvent | TouchEvent, tipoFirma: 'paciente' | 'testigo'): void {
    const canvas = tipoFirma === 'paciente' ? this.firmaPacienteCanvas : this.firmaTestigoCanvas;
    const context = tipoFirma === 'paciente' ? this.firmaPacienteContext : this.firmaTestigoContext;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (tipoFirma === 'paciente') {
      this.firmaPacienteDrawing = true;
    } else {
      this.firmaTestigoDrawing = true;
    }
    
    context.beginPath();
    context.moveTo(x, y);
  }

  dibujar(event: MouseEvent | TouchEvent, tipoFirma: 'paciente' | 'testigo'): void {
    if ((tipoFirma === 'paciente' && !this.firmaPacienteDrawing) || 
        (tipoFirma === 'testigo' && !this.firmaTestigoDrawing)) {
      return;
    }
    
    const canvas = tipoFirma === 'paciente' ? this.firmaPacienteCanvas : this.firmaTestigoCanvas;
    const context = tipoFirma === 'paciente' ? this.firmaPacienteContext : this.firmaTestigoContext;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  }

  detenerDibujo(tipoFirma: 'paciente' | 'testigo'): void {
    if (tipoFirma === 'paciente') {
      this.firmaPacienteDrawing = false;
    } else {
      this.firmaTestigoDrawing = false;
    }
  }

  // Método para limpiar el canvas
  limpiarFirma(tipoFirma: 'paciente' | 'testigo'): void {
    const canvas = tipoFirma === 'paciente' ? this.firmaPacienteCanvas : this.firmaTestigoCanvas;
    const context = tipoFirma === 'paciente' ? this.firmaPacienteContext : this.firmaTestigoContext;
    
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Método para guardar la firma
  guardarFirma(tipoFirma: 'paciente' | 'testigo'): void {
    const canvas = tipoFirma === 'paciente' ? this.firmaPacienteCanvas : this.firmaTestigoCanvas;
    
    if (canvas) {
      // Convertir la firma a base64
      const firmaBase64 = canvas.toDataURL('image/png');
      
      if (tipoFirma === 'paciente') {
        this.firmaPaciente = firmaBase64;
        this.messageUtils.mostrarExito('Firma guardada', 'La firma del paciente se ha guardado correctamente.');
      } else {
        this.firmaTestigo = firmaBase64;
        this.messageUtils.mostrarExito('Firma guardada', 'La firma del testigo se ha guardado correctamente.');
      }
      
      // Aquí iría la lógica para guardar en Frappe
      // Por ahora solo mostramos mensaje
    }
  }

  // Método para cerrar el modal de firma
  cerrarModalFirma(tipoFirma: 'paciente' | 'testigo'): void {
    if (tipoFirma === 'paciente') {
      this.mostrarFirmaPaciente = false;
    } else {
      this.mostrarFirmaTestigo = false;
    }
  }

  // Método para descargar documento
  descargarDocumento(consentimiento: OKM_ConsentimientoAm): void {
    if (consentimiento.conam_documento) {
      // En una implementación real, se descargaría el documento
      this.messageUtils.mostrarExito('Documento', 'Descarga del documento iniciada');
    } else {
      this.messageUtils.mostrarError('Error', 'No hay documento disponible para descargar');
    }
  }

  // Método para obtener descripción del tipo de consentimiento
  getTipoConsentimiento(tipcon_codigo: string): string {
    const tipo = this.tiposConsentimiento.find(t => t.tipcon_codigo === tipcon_codigo);
    return tipo ? tipo.tipcon_desc : tipcon_codigo;
  }
}