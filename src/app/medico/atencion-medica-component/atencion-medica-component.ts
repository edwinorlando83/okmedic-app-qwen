// src/app/atencion-medica/atencion-medica.component.ts
import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';

interface Consulta {
  id: string;
  paciente: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'en_curso' | 'completada';
  prioridad: 'normal' | 'urgente';
}

@Component({
  selector: 'app-atencion-medica',
  standalone: true,
  imports: [NgFor, NgIf, TitleCasePipe,NgClass],
  templateUrl: './atencion-medica-component.html',
  styleUrls: ['./atencion-medica-component.css']
})
export class AtencionMedicaComponent {
  consultas: Consulta[] = [
    {
      id: 'C001',
      paciente: 'Carlos Mendoza',
      hora: '09:00',
      motivo: 'Consulta General',
      estado: 'pendiente',
      prioridad: 'normal'
    },
    {
      id: 'C002',
      paciente: 'Ana Rodríguez',
      hora: '10:30',
      motivo: 'Control de Diabetes',
      estado: 'en_curso',
      prioridad: 'normal'
    },
    {
      id: 'C003',
      paciente: 'Luis Fernández',
      hora: '11:15',
      motivo: 'Revisión Postoperatoria',
      estado: 'pendiente',
      prioridad: 'urgente'
    },
    {
      id: 'C004',
      paciente: 'María González',
      hora: '14:00',
      motivo: 'Chequeo Anual',
      estado: 'completada',
      prioridad: 'normal'
    }
  ];

  selectedDate = new Date().toISOString().split('T')[0];

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'pendiente': return 'badge-warning';
      case 'en_curso': return 'badge-info';
      case 'completada': return 'badge-success';
      default: return 'badge-secondary';
    }
  }

  getPrioridadIcon(prioridad: string): string {
    return prioridad === 'urgente' ? 'fas fa-exclamation-triangle text-danger me-1' : '';
  }

  iniciarConsulta(consulta: Consulta): void {
    console.log('Iniciar consulta:', consulta.id);
    // Lógica para iniciar consulta
  }

  completarConsulta(consulta: Consulta): void {
    console.log('Completar consulta:', consulta.id);
    // Lógica para completar consulta
  }
}