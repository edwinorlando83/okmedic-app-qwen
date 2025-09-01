// src/app/detalle-atencion-lugar-atencion/detalle-atencion-lugar-atencion.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';  
import { finalize, catchError } from 'rxjs/operators'; 
import { FrappeApiService } from '../../../services/frappe-api.service'; 
import { MessageUtilsService } from '../../../utils/message-utils.service';
import { AtencionService } from '../../../services/atencion.service';
 
// src/app/interfaces/okm-lugaratencion.interface.ts
export interface OKM_LugarAtencion {
  name: string;        // lugate_codigo
  lugate_desc: string; // Descripción del lugar
  // Puedes añadir otros campos si los necesitas
}

// src/app/interfaces/okm-atencion.interface.ts (si aún no existe o necesitas actualizarla)
export interface OKM_Atencion {
  name: string; // El ID del documento (ate_id)
  lugate_codigo?: OKM_LugarAtencion | string; // Puede ser un objeto o solo el name
  // ... otros campos de OKM_ATENCION
}
@Component({
  selector: 'app-detalle-atencion-lugar-atencion',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './detalle-atencion-lugar-atencion.html',
  styleUrl: './detalle-atencion-lugar-atencion.css'
})
export class DetalleAtencionLugarAtencion implements OnInit {
  @Input() ate_id: string = '';

  // Datos del componente
  lugaresAtencion: any[] = [];
  lugate_codigo_seleccionado: string = ''; // Valor seleccionado en el combo
  cargandoLugares = false;
  cargandoActualizacion = false;
  error = '';
  exito = '';

  constructor(
    private frappeApiService: FrappeApiService,
    private authService: AtencionService,
    private messageUtils: MessageUtilsService
  ) { }

  ngOnInit(): void {
    if (this.ate_id) {
      this.cargarLugaresAtencion();
      this.cargarLugarActual();
    } else {
      this.error = 'No se proporcionó el ID de la atención.';
    }
  }

  private cargarLugaresAtencion(): void {
    this.cargandoLugares = true;
    this.error = '';

    this.authService.getLugaresAtencion().subscribe({
      next: (lugares) => {
        this.lugaresAtencion = lugares || [];
        this.cargandoLugares = false;
      },
      error: (err) => {
        this.cargandoLugares = false;
        this.error = 'Error al cargar los lugares de atención.';
        console.error('Error al cargar lugares:', err);
      }
    });
  }

  private cargarLugarActual(): void {
    // Cargar el documento completo de OKM_ATENCION para obtener el lugate_codigo
    this.frappeApiService.get<any>('OKM_ATENCION', this.ate_id ).subscribe({
      next: (data) => {
        // El valor puede venir como string (solo el name) o como objeto
        if (data && data.lugate_codigo) {
          this.lugate_codigo_seleccionado = typeof data.lugate_codigo === 'string' 
            ? data.lugate_codigo 
            : data.lugate_codigo.name;
        }
      },
      error: (err) => {
        console.error('Error al cargar lugar actual:', err);
        this.error = 'Error al cargar el lugar de atención actual.';
      }
    });
  }

  actualizarLugarAtencion(): void {
    if (!this.lugate_codigo_seleccionado) {
      this.messageUtils.mostrarAdvertencia('Campo requerido', 'Por favor, seleccione un lugar de atención.');
      return;
    }

    this.messageUtils.mostrarConfirmacion(
      '¿Actualizar lugar de atención?',
      '¿Está seguro de que desea actualizar el lugar de atención?',
      'Sí, actualizar',
      'Cancelar'
    ).then((confirmado) => {
      if (confirmado) {
        this.procederConActualizacion();
      }
    });
  }

  private procederConActualizacion(): void {
    this.cargandoActualizacion = true;
    this.error = '';
    this.exito = '';

    const datosAEnviar = {
      lugate_codigo: this.lugate_codigo_seleccionado
    };

    this.frappeApiService.update<any>('OKM_ATENCION', this.ate_id, datosAEnviar)
      .pipe(
        finalize(() => this.cargandoActualizacion = false)
      )
      .subscribe({
        next: (response) => {
          this.exito = 'Lugar de atención actualizado correctamente.';
          this.messageUtils.mostrarExito('Actualización exitosa', this.exito);
          console.log('Lugar de atención actualizado:', response);
        },
        error: (err) => {
          this.error = 'Error al actualizar el lugar de atención.';
          this.messageUtils.mostrarErrorDeFrappe('Error en actualización', err);
          console.error('Error al actualizar lugar:', err);
        }
      });
  }
}