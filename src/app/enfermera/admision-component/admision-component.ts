// src/app/admision/admision.component.ts
import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

interface Paciente {
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  email: string;
  direccion: string;
  ocupacion: string;
  estadoCivil: string;
}

@Component({
  selector: 'app-admision',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './admision-component.html',
  styleUrls: ['./admision-component.css']
})
export class AdmisionComponent {
  paciente: Paciente = {
    nombres: '',
    apellidos: '',
    cedula: '',
    fechaNacimiento: '',
    genero: '',
    telefono: '',
    email: '',
    direccion: '',
    ocupacion: '',
    estadoCivil: ''
  };

  generos = ['Masculino', 'Femenino', 'Otro'];
  estadosCiviles = ['Soltero', 'Casado', 'Divorciado', 'Viudo'];

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Paciente registrado:', this.paciente);
      // Lógica para guardar paciente
      alert('Paciente registrado exitosamente');
      form.resetForm();
    } else {
      console.log('Formulario inválido');
    }
  }

  buscarPaciente(): void {
    console.log('Buscar paciente por cédula:', this.paciente.cedula);
    // Lógica para buscar paciente
  }
}