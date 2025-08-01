// src/app/configuracion/configuracion.component.ts
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

interface Configuracion {
  perfil: {
    nombre: string;
    email: string;
    telefono: string;
    foto: string;
  };
  notificaciones: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  preferencias: {
    tema: 'claro' | 'oscuro' | 'sistema';
    idioma: string;
    zonaHoraria: string;
  };
  seguridad: {
    cambiarContrasena: boolean;
    autenticacion2fa: boolean;
  };
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [NgFor, NgIf, TitleCasePipe,NgClass,FormsModule],
  templateUrl: './configuracion-component.html',
  styleUrls: ['./configuracion-component.css']
})
export class ConfiguracionComponent {
  configuracion: Configuracion = {
    perfil: {
      nombre: 'Dr. Manuel Chica',
      email: 'manuel.chica@okmedic.com',
      telefono: '0987654321',
      foto: 'https://tudoctor.okmedic.online/files/Dr.   Alejandro Chica.jpeg'
    },
    notificaciones: {
      email: true,
      sms: false,
      push: true
    },
    preferencias: {
      tema: 'sistema',
      idioma: 'es',
      zonaHoraria: 'America/Guayaquil'
    },
    seguridad: {
      cambiarContrasena: false,
      autenticacion2fa: false
    }
  };

  temas = [
    { valor: 'claro', nombre: 'Claro' },
    { valor: 'oscuro', nombre: 'Oscuro' },
    { valor: 'sistema', nombre: 'Según el sistema' }
  ];

  idiomas = [
    { valor: 'es', nombre: 'Español' },
    { valor: 'en', nombre: 'English' }
  ];

  zonasHorarias = [
    { valor: 'America/Guayaquil', nombre: 'Guayaquil (GMT-5)' },
    { valor: 'America/Bogota', nombre: 'Bogotá (GMT-5)' },
    { valor: 'America/Lima', nombre: 'Lima (GMT-5)' }
  ];

  guardarCambios(): void {
    console.log('Configuración guardada:', this.configuracion);
    alert('Configuración guardada exitosamente');
  }

  cambiarFoto(): void {
    console.log('Cambiar foto de perfil');
    // Lógica para cambiar foto
  }

  cambiarContrasena(): void {
    console.log('Abrir formulario de cambio de contraseña');
    this.configuracion.seguridad.cambiarContrasena = true;
  }

  cancelarCambioContrasena(): void {
    this.configuracion.seguridad.cambiarContrasena = false;
  }

  guardarNuevaContrasena(): void {
    console.log('Guardar nueva contraseña');
    this.configuracion.seguridad.cambiarContrasena = false;
    alert('Contraseña actualizada');
  }
}