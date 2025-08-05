import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { OKM_Paciente } from '../../interfaces/okm-paciente.interface';
import { MessageUtilsService } from '../../utils/message-utils.service';
 

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule,NgClass],
  templateUrl: './paciente-list-component.html',
  styleUrls: ['./paciente-list-component.css']
})
export class PacienteListComponent implements OnInit {
  pacientes: OKM_Paciente[] = [];
  cargando = false; 
  error = '';
  filtro = '';
  paginaActual = 1;
  registrosPorPagina = 20;
  totalRegistros = 0;

  constructor(
    private pacienteService: PacienteService,
    private messageUtils: MessageUtilsService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.cargando = true;
    this.error = '';
    const filters: any = {};
    if (this.filtro) {
      filters.pac_nombrecompleto = ['like', `%${this.filtro}%`];
    }

    this.pacienteService.getPacientes(
      filters,
      'pac_papellido asc, pac_pnombre asc',
      (this.paginaActual - 1) * this.registrosPorPagina,
      this.registrosPorPagina
    ).subscribe({
      next: (response:any) => {
       
        this.pacientes = response;
        this.totalRegistros =   this.pacientes.length; // Ajustar según cómo obtengas el total real
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pacientes:', err);
        this.error = 'Error al cargar la lista de pacientes.';
        this.cargando = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar pacientes', err);
      }
    });
  }

  onBuscar(): void {
    this.paginaActual = 1; // Reiniciar a la primera página
    this.cargarPacientes();
  }

  onLimpiar(): void {
    this.filtro = '';
    this.paginaActual = 1;
    this.cargarPacientes();
  }

  verDetalle(paciente: OKM_Paciente): void {
    this.router.navigate(['/pacientes', paciente.name]);
  }

  editarPaciente(paciente: OKM_Paciente): void {
    this.router.navigate(['/pacientes/editar', paciente.name]);
  }

  // Métodos para paginación (implementación básica)
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarPacientes();
    }
  }

  paginaSiguiente(): void {
    // Calcular total de páginas basado en totalRegistros y registrosPorPagina
    const totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
    if (this.paginaActual < totalPaginas) {
      this.paginaActual++;
      this.cargarPacientes();
    }
  }
}