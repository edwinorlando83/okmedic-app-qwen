// src/app/signos-vitales/signos-vitales.component.ts
import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';

interface RegistroSignos {
  id: string;
  paciente: string;
  fecha: string;
  hora: string;
  temperatura: number;
  presion: string; // Ej: "120/80"
  pulso: number;
  respiracion: number;
  saturacion: number;
  peso: number;
  talla: number;
  imc: number;
  estado: 'registrado' | 'pendiente' | 'revisado';
}

@Component({
  selector: 'app-signos-vitales',
  standalone: true,
  imports: [NgFor, NgIf, TitleCasePipe,NgClass],
  templateUrl: './signos-vitales-component.html',
  styleUrls: ['./signos-vitales-component.css']
})
export class SignosVitalesComponent {
  registros: RegistroSignos[] = [
    {
      id: 'SV001',
      paciente: 'Carlos Mendoza',
      fecha: '2023-06-15',
      hora: '09:30',
      temperatura: 36.8,
      presion: '120/80',
      pulso: 72,
      respiracion: 16,
      saturacion: 98,
      peso: 75.5,
      talla: 175,
      imc: 24.6,
      estado: 'registrado'
    },
    {
      id: 'SV002',
      paciente: 'Ana Rodríguez',
      fecha: '2023-06-15',
      hora: '10:15',
      temperatura: 37.2,
      presion: '130/85',
      pulso: 80,
      respiracion: 18,
      saturacion: 96,
      peso: 68.2,
      talla: 165,
      imc: 25.1,
      estado: 'pendiente'
    },
    {
      id: 'SV003',
      paciente: 'Luis Fernández',
      fecha: '2023-06-15',
      hora: '11:00',
      temperatura: 36.5,
      presion: '118/75',
      pulso: 68,
      respiracion: 15,
      saturacion: 99,
      peso: 82.1,
      talla: 180,
      imc: 25.3,
      estado: 'revisado'
    }
  ];

  selectedDate = new Date().toISOString().split('T')[0];

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'registrado': return 'badge-primary';
      case 'pendiente': return 'badge-warning';
      case 'revisado': return 'badge-success';
      default: return 'badge-secondary';
    }
  }

  registrarSignos(): void {
    console.log('Abrir formulario de registro de signos vitales');
    // Lógica para abrir formulario
  }

  verDetalles(registro: RegistroSignos): void {
    console.log('Ver detalles:', registro.id);
    // Lógica para ver detalles
  }
}