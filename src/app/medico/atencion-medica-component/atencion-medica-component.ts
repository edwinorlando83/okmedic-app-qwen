// src/app/atencion-medica/atencion-medica.component.ts
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
 
import { finalize } from 'rxjs/operators';
import { FrappeApiService } from '../../services/frappe-api.service';
import { MessageUtilsService } from '../../utils/message-utils.service';
import { FechaCompletaPipe } from '../../pipes/fecha-completa.pipe';
import { HoraFormatoPipe } from '../../pipes/hora-formato.pipe';

// Modelo para una atención médica
interface AtencionMedica {
  name: string;
  lugate_codigo: { lugate_desc: string } | string; // Puede ser objeto o string
  cro_codigo: { cro_desc: string } | string;
  pac_historiaclinica: {
    pac_nombrecompleto: string;
    pac_identificacion: string;
    pac_fechanac: string;
    sex_codigo: string; // "1" o "2"
  } | string;
  prosal_cedopasaporte: { prosal_nombrecompleto: string } | string;
  ate_edadfecha: string;
  ate_fechaini: string;
  ate_horaini: string;
  proate_codigo: string; // "E", "F", "I", "M"
  ate_fechafin?: string;
  ate_horafin?: string;
  pac_nombrecompleto?: string;
}

@Component({
  selector: 'app-atencion-medica',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe, TitleCasePipe,NgClass,
     FechaCompletaPipe,  
    HoraFormatoPipe 
  ],
  templateUrl: './atencion-medica-component.html',
  styleUrls: ['./atencion-medica-component.css']
})
export class AtencionMedicaComponent implements OnInit {
  atenciones: any[] = [];
  atencionesFiltradas: any[] = [];
  cargando = false;
  error = '';
  
  // Paginación
  paginaActual = 1;
  registrosPorPagina = 20;
  totalRegistros = 0;
  totalPaginas = 0;

  // Filtros
  filtros = {
    fechaDesde: '',
    fechaHasta: '',
    nombrePaciente: '',
    cedulaPaciente: '',
    lugarAtencion: '',
    cronologia: '',
    sexo: '',
    estado: ''
  };

  // Catálogos para filtros
  lugaresAtencion: any[] = [];
  cronologias: any[] = [];

  constructor(
    private frappeApiService: FrappeApiService,
    private messageUtils: MessageUtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFechas();
    this.cargarCatalogos();
    this.cargarAtenciones();
  }

  private inicializarFechas(): void {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    
    this.filtros.fechaDesde = primerDiaMes.toISOString().split('T')[0];
    this.filtros.fechaHasta = ultimoDiaMes.toISOString().split('T')[0];
  }

  private cargarCatalogos(): void {
    // Cargar lugares de atención
  this.frappeApiService.list<{ name: string; lugate_desc: string }>('OKM_LUGARATENCION', {
    fields: ['name', 'lugate_desc'],
    limitPageLength: 1000
  }).subscribe({
    next: (lugares) => { // <- 'lugares' es de tipo { name: string; lugate_desc: string; }[]
      this.lugaresAtencion = lugares || []; // <- Asignar directamente el arreglo
    },
    error: (err) => {
      console.error('Error al cargar lugares de atención:', err);
      this.messageUtils.mostrarErrorDeFrappe('Error al cargar lugares de atención', err);
    }
  });

    // Cargar cronologías
    this.frappeApiService.list<{ name: string; cro_desc: string }>('OKM_CRONOLOGIA', {
    fields: ['name', 'cro_desc'],
    limitPageLength: 1000
  }).subscribe({
    next: (cronos) => { // <- 'cronos' es de tipo { name: string; cro_desc: string; }[]
      this.cronologias = cronos || []; // <- Asignar directamente el arreglo
    },
    error: (err) => {
      console.error('Error al cargar cronologías:', err);
      this.messageUtils.mostrarErrorDeFrappe('Error al cargar cronologías', err);
    }
  });
  }

  cargarAtenciones(): void {
    this.cargando = true;
    this.error = '';

    // Construir filtros para la API
    let filtrosApi: any[] = [];
    
    // Filtro por rango de fechas
    if (this.filtros.fechaDesde) {
      filtrosApi.push(['ate_fechaini', '>=', this.filtros.fechaDesde]);
    }
    if (this.filtros.fechaHasta) {
      filtrosApi.push(['ate_fechaini', '<=', this.filtros.fechaHasta]);
    }

    // Filtro por nombre de paciente
    if (this.filtros.nombrePaciente) {
      filtrosApi.push(['pac_historiaclinica.pac_nombrecompleto', 'like', `%${this.filtros.nombrePaciente}%`]);
    }

    // Filtro por cédula de paciente
    if (this.filtros.cedulaPaciente) {
      filtrosApi.push(['pac_historiaclinica.pac_identificacion', 'like', `%${this.filtros.cedulaPaciente}%`]);
    }

    // Filtro por lugar de atención
    if (this.filtros.lugarAtencion) {
      filtrosApi.push(['lugate_codigo', '=', this.filtros.lugarAtencion]);
    }

    // Filtro por cronología
    if (this.filtros.cronologia) {
      filtrosApi.push(['cro_codigo', '=', this.filtros.cronologia]);
    }

    // Filtro por sexo
    if (this.filtros.sexo) {
      filtrosApi.push(['pac_historiaclinica.sex_codigo', '=', this.filtros.sexo]);
    }

    // Filtro por estado
    if (this.filtros.estado) {
      filtrosApi.push(['proate_codigo', '=', this.filtros.estado]);
    }

    // Filtro por unidad médica (asumiendo que viene del auth service)
    // filtrosApi.push(['unimed_codigo', '=', '1070349']);

    const options: any = {
      fields: [
        'name',
        'lugate_codigo.lugate_desc',
        'cro_codigo.cro_desc',
        'pac_historiaclinica.pac_nombrecompleto',
        'pac_historiaclinica.pac_identificacion',
        'pac_historiaclinica.pac_fechanac',
        'pac_historiaclinica.sex_codigo',
        'pac_historiaclinica.pac_email',
        'pac_historiaclinica.pac_celular',
        'prosal_cedopasaporte.prosal_nombrecompleto',
        'ate_edadfecha',
        'ate_fechaini',
        'ate_horaini',
        'proate_codigo',
        'ate_fechafin',
        'ate_horafin'
      ],
      filters: filtrosApi,
      orderBy: 'ate_fechaini desc, ate_horaini desc',
      limitStart: (this.paginaActual - 1) * this.registrosPorPagina,
      limitPageLength: this.registrosPorPagina
    };

    this.frappeApiService.list<AtencionMedica>('OKM_ATENCION', options)
  .pipe(finalize(() => this.cargando = false))
  .subscribe({
    next: (response) => {  
     
      this.atenciones = response || [];  
      this.atencionesFiltradas = [...this.atenciones];
       console.log('Atenciones cargadas:', this.atencionesFiltradas );
      // Nota: Para la paginación real, necesitarías el total del servidor
      this.totalRegistros = this.atenciones.length;
      this.totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
    },
    error: (err) => {
      console.error('Error al cargar atenciones:', err);
          this.error = 'Error al cargar las atenciones médicas.';
          this.messageUtils.mostrarErrorDeFrappe('Error al cargar atenciones', err);
    }
  });

    
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.cargarAtenciones();
  }

  limpiarFiltros(): void {
    this.filtros = {
      fechaDesde: '',
      fechaHasta: '',
      nombrePaciente: '',
      cedulaPaciente: '',
      lugarAtencion: '',
      cronologia: '',
      sexo: '',
      estado: ''
    };
    this.inicializarFechas();
    this.paginaActual = 1;
    this.cargarAtenciones();
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarAtenciones();
    }
  }

  verDetalle(atencion: AtencionMedica): void {
    console.log('Ver detalle de atención:', atencion.name);
    // Aquí puedes navegar a una página de detalle o abrir un modal
    // this.router.navigate(['/atencion-medica', atencion.name]);
    alert(`Funcionalidad para ver detalle de ${atencion.name} aún no implementada.`);
  }

  // Métodos auxiliares para formateo
  formatearSexo(sexoCodigo: string): string {
    switch(sexoCodigo) {
      case '1': return 'Hombre';
      case '2': return 'Mujer';
      default: return 'No especificado';
    }
  }

  formatearEstado(estadoCodigo: string): string {
    switch(estadoCodigo) {
      case 'E': return 'En Enfermería';
      case 'F': return 'Finalizada';
      case 'I': return 'Iniciada';
      case 'M': return 'En Consultorio Médico';
      default: return estadoCodigo;
    }
  }

  formatearBadgeClase(estadoCodigo: string): string {
    switch(estadoCodigo) {
      case 'E': return 'badge-warning';
      case 'F': return 'badge-success';
      case 'I': return 'badge-primary';
      case 'M': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  getPageNumbers(): number[] {
    const delta = 2; // Número de páginas a mostrar antes y después de la actual
    const currentPage = this.paginaActual;
    const totalPages = this.totalPaginas;

    // Validaciones básicas
    if (totalPages <= 1) {
      return [];
    }

    const range: number[] = [];
    const rangeWithDots: number[] = [];

    // Determinar el rango de páginas a mostrar
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Agregar la primera página y puntos suspensivos al principio si es necesario
    if (range[0] > 1) {
      rangeWithDots.push(1);
      if (range[0] > 2) {
        rangeWithDots.push(-1); // -1 representa puntos suspensivos
      }
    }

    // Agregar las páginas del rango
    rangeWithDots.push(...range);

    // Agregar la última página y puntos suspensivos al final si es necesario
    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) {
        rangeWithDots.push(-1); // -1 representa puntos suspensivos
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }
}