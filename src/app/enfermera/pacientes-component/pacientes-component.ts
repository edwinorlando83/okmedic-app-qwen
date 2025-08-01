// src/app/pacientes/pacientes.component.ts
import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Paciente {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  edad: number;
  genero: string;
  telefono: string;
  ultimaVisita: string;
  proximaCita: string;
  estado: 'activo' | 'inactivo' | 'nuevo';
}

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [NgFor, NgIf ,   FormsModule , TitleCasePipe,NgClass],
  templateUrl: './pacientes-component.html',
  styleUrls: ['./pacientes-component.css']
})
export class PacientesComponent {
  pacientes: Paciente[] = [
    {
      id: 'P001',
      cedula: '1234567890',
      nombres: 'María',
      apellidos: 'González',
      edad: 35,
      genero: 'Femenino',
      telefono: '0987654321',
      ultimaVisita: '2023-06-10',
      proximaCita: '2023-06-20',
      estado: 'activo'
    },
    {
      id: 'P002',
      cedula: '0987654321',
      nombres: 'Pedro',
      apellidos: 'Martínez',
      edad: 42,
      genero: 'Masculino',
      telefono: '0912345678',
      ultimaVisita: '2023-06-05',
      proximaCita: '2023-06-25',
      estado: 'activo'
    },
    {
      id: 'P003',
      cedula: '1122334455',
      nombres: 'Ana',
      apellidos: 'Rodríguez',
      edad: 28,
      genero: 'Femenino',
      telefono: '0987651234',
      ultimaVisita: '2023-06-12',
      proximaCita: '',
      estado: 'nuevo'
    },
    {
      id: 'P004',
      cedula: '5544332211',
      nombres: 'Carlos',
      apellidos: 'Mendoza',
      edad: 55,
      genero: 'Masculino',
      telefono: '0912349876',
      ultimaVisita: '2023-05-20',
      proximaCita: '',
      estado: 'inactivo'
    }
  ];

  searchTerm = '';
  selectedDate = new Date().toISOString().split('T')[0];

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'activo': return 'badge-success';
      case 'inactivo': return 'badge-secondary';
      case 'nuevo': return 'badge-primary';
      default: return 'badge-light';
    }
  }

  verFicha(paciente: Paciente): void {
    console.log('Ver ficha de:', paciente.id);
    // Lógica para ver ficha
  }

  programarCita(paciente: Paciente): void {
    console.log('Programar cita para:', paciente.id);
    // Lógica para programar cita
  }

  editarPaciente(paciente: Paciente): void {
    console.log('Editar paciente:', paciente.id);
    // Lógica para editar paciente
  }
}