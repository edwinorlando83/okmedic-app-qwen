import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { OKM_Paciente } from '../../interfaces/okm-paciente.interface';
import { MessageUtilsService } from '../../utils/message-utils.service';
 

@Component({
  selector: 'app-paciente-detail',
  standalone: true,
  imports: [NgFor, NgIf,NgClass],
  templateUrl: './paciente-detail-component.html',
  styleUrls: ['./paciente-detail-component.css']
})
export class PacienteDetailComponent implements OnInit {
  paciente: OKM_Paciente | null = null;
  cargando = false;
  error = '';

  constructor(
    private pacienteService: PacienteService,
    private messageUtils: MessageUtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarPaciente(id);
      }
    });
  }

  private cargarPaciente(id: string): void {
    this.cargando = true;
    this.error = '';
    this.pacienteService.getPaciente(id).subscribe({
      next: (data) => {
        this.paciente = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar paciente:', err);
        this.error = 'Error al cargar los datos del paciente.';
        this.cargando = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar paciente', err);
      }
    });
  }

  editarPaciente(): void {
    if (this.paciente) {
      this.router.navigate(['/pacientes/editar', this.paciente.name]);
    }
  }

  volver(): void {
    this.router.navigate(['/pacientes']);
  }
}