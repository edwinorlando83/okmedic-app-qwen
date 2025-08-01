// src/app/components/paciente-selector/paciente-selector.component.ts
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FrappeApiService } from '../../services/frappe-api.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

// Interfaz para el paciente
 
@Component({
  selector: 'app-paciente-selector-modal',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule,DatePipe],
  templateUrl: './paciente-selector.component.html',
  styleUrls: ['./paciente-selector.component.css']
})
export class PacienteSelectorModalComponent implements OnInit {
  pacientes: Paciente[] = [];
   pacientesConEdad: any[] = [];
  cargando = false;
  error = '';
  terminoBusqueda = '';
  
  // Paginación
  paginaActual = 1;
  registrosPorPagina = 20;
  totalRegistros = 0;
  totalPaginas = 0;
  
  // Para búsqueda con debounce
  private searchSubject = new Subject<string>();

  constructor(
    public activeModal: NgbActiveModal,
    private frappeApiService: FrappeApiService
  ) {}

  ngOnInit(): void {
    // Configurar el debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(termino => {
      this.paginaActual = 1;
      this.cargarPacientes();
    });

    // Cargar datos iniciales
    this.cargarPacientes();
  }

    cargarPacientes(): void {
    this.cargando = true;
    this.error = '';

    // Preparar filtros usando el tipo correcto
    let filtros: any[] = []; // Usamos any[] temporalmente para evitar problemas de tipos
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      // Para búsqueda con OR, necesitamos usar orFilters
      // Vamos a preparar los filtros como un array de arrays
      filtros = [
        ['pac_nombrecompleto', 'like', `%${termino}%`],
        ['pac_identificacion', 'like', `%${termino}%`]
      ];
    }

    // Usar orFilters para búsqueda OR
    const options: any = {
      fields: ['name', 'pac_nombrecompleto', 'pac_identificacion', 'pac_fechanac'],
      orderBy: 'pac_nombrecompleto asc',
      limitStart: (this.paginaActual - 1) * this.registrosPorPagina,
      limitPageLength: this.registrosPorPagina
    };

    // Solo añadir orFilters si hay término de búsqueda
    if (filtros.length > 0) {
      options.orFilters = filtros;
    }

    this.frappeApiService.list<Paciente>('OKM_PACIENTE', options).subscribe({
      next: (data) => {
        this.pacientes = data;
                this.pacientesConEdad = data.map(paciente => ({
          ...paciente,
          edad: this.calcularEdad(paciente.pac_fechanac)
        }));
        // Nota: Frappe no devuelve automáticamente el total de registros.
        this.totalRegistros = data.length; // Placeholder
        this.totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.error = 'Error al cargar la lista de pacientes.';
        this.cargando = false;
      }
    });
  }

  // Método para búsqueda con debounce
  onSearchInput(): void {
    this.searchSubject.next(this.terminoBusqueda);
  }

  // Paginación
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarPacientes();
    }
  }

  getPageNumbers(): number[] {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: number[] = [];
    
    for (
      let i = Math.max(1, this.paginaActual - delta);
      i <= Math.min(this.totalPaginas, this.paginaActual + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 1) {
      rangeWithDots.push(1);
      if (range[0] > 2) {
        rangeWithDots.push(-1);
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < this.totalPaginas) {
      if (range[range.length - 1] < this.totalPaginas - 1) {
        rangeWithDots.push(-1);
      }
      rangeWithDots.push(this.totalPaginas);
    }

    return rangeWithDots;
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.activeModal.close(paciente);
  }

  cancelar(): void {
    this.activeModal.dismiss('cancelado');
  }

  private calcularEdad(fechaNacimiento: string): number | null {
    if (!fechaNacimiento) return null;
    
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    
    if (isNaN(fechaNac.getTime())) return null;
    
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad >= 0 ? edad : null;
  }

}