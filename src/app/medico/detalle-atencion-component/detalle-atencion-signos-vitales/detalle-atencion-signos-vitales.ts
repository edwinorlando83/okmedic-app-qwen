import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { AtencionService } from '../../../services/atencion.service';
import { MessageUtilsService } from '../../../utils/message-utils.service';
import { OKM_Signovital } from '../../../interfaces/okm_signovital.interface';

@Component({
  selector: 'app-detalle-atencion-signos-vitales',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './detalle-atencion-signos-vitales.html',
  styleUrl: './detalle-atencion-signos-vitales.css'
})
export class DetalleAtencionSignosVitales implements OnInit {
  @Input() ate_id: string = '';

  // Datos de signos vitales
  signoVital: OKM_Signovital | null = null;
  cargandoSignosVitales = false;
  errorSignosVitales = '';
  modoEdicion = false;

  constructor(
    private authService: AtencionService,
    private messageUtils: MessageUtilsService
  ) { }

  ngOnInit(): void {
    if (this.ate_id) {
      this.cargarSignosVitales();
    } else {
      console.error('No se proporcionó el ID de atención (ate_id)');
      this.messageUtils.mostrarError('Error', 'No se proporcionó el ID de atención.');
    }
  }

  private cargarSignosVitales(): void {
    this.cargandoSignosVitales = true;
    this.errorSignosVitales = '';

    // Filtrar por ate_id usando el método getChildTableRecords
    this.authService.getChildTableRecords<OKM_Signovital>(
      'OKM_ATENCION',
      this.ate_id,
      'ate_signosvitales', // Campo en OKM_ATENCION que contiene la tabla hija
      'OKM_SIGNOVITAL'
    ).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.signoVital = data[0];
          this.modoEdicion = true;
        } else {
          // Crear nuevo registro
          this.signoVital = {
            parent: this.ate_id,
            parentfield: 'ate_signosvitales',
            parenttype: 'OKM_ATENCION',
            ate_id: this.ate_id
          };
          this.modoEdicion = false;
        }
        this.cargandoSignosVitales = false;
      },
      error: (err) => {
        console.error('Error al cargar signos vitales:', err);
        this.errorSignosVitales = 'Error al cargar signos vitales.';
        this.cargandoSignosVitales = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar signos vitales', err);
      }
    });
  }

  guardar(): void {
    if (!this.signoVital) {
      this.messageUtils.mostrarError('Error', 'No hay datos para guardar');
      return;
    }

    if (this.modoEdicion) {
      // Actualizar
      this.authService.updateChildRecord<OKM_Signovital>(
        'OKM_SIGNOVITAL',
        this.signoVital.name!,
        this.signoVital
      ).subscribe({
        next: (updated) => {
          this.messageUtils.mostrarExito('Signo vital actualizado', 'El registro de signos vitales se ha actualizado correctamente.');
          this.cargarSignosVitales(); // Recargar para reflejar cambios
        },
        error: (err) => {
          this.messageUtils.mostrarErrorDeFrappe('Error al actualizar', err);
        }
      });
    } else {
      // Crear
      this.authService.createChildRecord<OKM_Signovital>(
        'OKM_SIGNOVITAL',
        this.signoVital
      ).subscribe({
        next: (created) => {
          this.messageUtils.mostrarExito('Signo vital creado', 'El registro de signos vitales se ha creado correctamente.');
          this.modoEdicion = true;
          this.cargarSignosVitales(); // Recargar para reflejar cambios
        },
        error: (err) => {
          this.messageUtils.mostrarErrorDeFrappe('Error al crear', err);
        }
      });
    }
  }

  cancelar(): void {
    this.cargarSignosVitales();
  }

  calcularIMC(): void {
    if (this.signoVital && this.signoVital.sigvit_peso && this.signoVital.sigvit_altura) {
      // Convertir altura de cm a metros
      const alturaEnMetros = this.signoVital.sigvit_altura / 100;
      // Calcular IMC: peso / (altura)^2
      this.signoVital.sigvit_imc = parseFloat((this.signoVital.sigvit_peso / (alturaEnMetros * alturaEnMetros)).toFixed(2));
    }
  }
}