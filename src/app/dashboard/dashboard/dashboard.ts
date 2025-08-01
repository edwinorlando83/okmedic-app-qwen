// src/app/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ProfesionalSalud } from '../../services/auth.service';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  profesional: ProfesionalSalud | null = null;
  cards: any[] = []; // ✅ Cards dinámicas

  constructor(
    private authService: AuthService,
    public router: Router
  ) {
    this.profesional = this.authService.getProfesionalSalud();
    this.initializeCards(); // ✅ Inicializamos las cards según el rol
  }

  // ✅ Método para inicializar las cards según el rol
  private initializeCards(): void {
    if (this.profesional) {
      const rol = this.profesional.rol?.toUpperCase();

      switch (rol) {
        case 'DOCTOR':
          this.cards = [
            {
              title: 'Agenda del Día',
              icon: 'fas fa-calendar-alt',
              description: 'Gestiona tus citas programadas del día.',
              buttonText: 'Ver Agenda',
              action: () => this.router.navigate(['/agenda']),
              color: 'primary'
            },
            {
              title: 'Atención Médica',
              icon: 'fas fa-stethoscope',
              description: 'Inicia el proceso de consulta y fichas clínicas.',
              buttonText: 'Iniciar Atención',
              action: () => this.router.navigate(['/atencion-medica']),
              color: 'info'
            },
            {
              title: 'Pacientes',
              icon: 'fas fa-users',
              description: 'Administra el registro y datos de tus pacientes.',
              buttonText: 'Ver Pacientes',
              action: () => this.router.navigate(['/pacientes']),
              color: 'success'
            }
          ];
          break;

        case 'ENFERMERA':
          this.cards = [
            {
              title: 'Agenda',
              icon: 'fas fa-calendar-alt',
              description: 'Consulta las citas programadas del día.',
              buttonText: 'Ver Agenda',
              action: () => this.router.navigate(['/agenda']),
              color: 'primary'
            },
            {
              title: 'Signos Vitales',
              icon: 'fas fa-heartbeat',
              description: 'Registra y monitorea signos vitales de pacientes.',
              buttonText: 'Registrar Signos',
              action: () => this.router.navigate(['/signos-vitales']),
              color: 'warning'
            },
            {
              title: 'Admisión',
              icon: 'fas fa-user-plus',
              description: 'Registra nuevos pacientes o busca existentes.',
              buttonText: 'Ir a Admisión',
              action: () => this.router.navigate(['/admision']),
              color: 'success'
            }
          ];
          break;

        default:
          // Cards por defecto
          this.cards = [
            {
              title: 'Agenda',
              icon: 'fas fa-calendar-alt',
              description: 'Consulta las citas programadas.',
              buttonText: 'Ver Agenda',
              action: () => this.router.navigate(['/agenda']),
              color: 'primary'
            }
          ];
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getFotoProfesional(): string {
    return this.profesional?.foto || 'https://tudoctor.okmedic.online/files/tudoctorok.jpeg';
  }

  getNombreCompleto(): string {
    return this.profesional?.nombre || 'Profesional';
  }

  getCedula(): string {
    return this.profesional?.cedula || 'N/A';
  }

  getEmail(): string {
    return this.profesional?.email || 'N/A';
  }

  getTelefono(): string {
    return this.profesional?.telefono || 'N/A';
  }

  getRol(): string {
    return this.profesional?.rol || 'N/A';
  }
}