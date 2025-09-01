import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { AtencionService } from '../../../services/atencion.service';
import { MessageUtilsService } from '../../../utils/message-utils.service';
import { OKM_ExamenFisico } from '../../../interfaces/okm-examenfisico.interface';

@Component({
 selector: 'app-detalle-atencion-examen-fisco',

  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './detalle-atencion-examen-fisco.html',
  styleUrl: './detalle-atencion-examen-fisco.css'

})
export class DetalleAtencionExamenFisco implements OnInit {
  @Input() ate_id: string = '';

  // Datos del examen físico
  examenFisico: OKM_ExamenFisico | null = null;
  cargandoExamenFisico = false;
  errorExamenFisico = '';
  modoEdicion = false;

  // Lista de regiones/orgános disponibles
  regiones: any[] = [];

  constructor(
    private authService: AtencionService,
    private messageUtils: MessageUtilsService
  ) { }

  ngOnInit(): void {
    if (this.ate_id) {
      this.cargarExamenFisico();
      this.cargarRegiones();
    } else {
      console.error('No se proporcionó el ID de atención (ate_id)');
      this.messageUtils.mostrarError('Error', 'No se proporcionó el ID de atención.');
    }
  }

  private cargarRegiones(): void {
    // Cargar lista de regiones/orgános disponibles
    // Esta sería una llamada real al servicio, pero por ahora dejamos vacío
    // En una implementación real, cargarías desde OKM_DETREGION
    this.regiones = [
      { orgreg_codigo: 'CABEZA', detalle: 'Cabeza' },
      { orgreg_codigo: 'CUELLO', detalle: 'Cuello' },
      { orgreg_codigo: 'TORAX', detalle: 'Torax' },
      { orgreg_codigo: 'ABDOMEN', detalle: 'Abdomen' },
      { orgreg_codigo: 'MIEMBROS_SUPERIORES', detalle: 'Miembros Superiores' },
      { orgreg_codigo: 'MIEMBROS_INFERIORES', detalle: 'Miembros Inferiores' },
      { orgreg_codigo: 'PUERTA', detalle: 'Puerta' },
      { orgreg_codigo: 'PULMONES', detalle: 'Pulmones' },
      { orgreg_codigo: 'CORAZON', detalle: 'Corazón' },
      { orgreg_codigo: 'RIENES', detalle: 'Riñones' },
      { orgreg_codigo: 'HEPATICOS', detalle: 'Hepáticos' },
      { orgreg_codigo: 'NERVIOS', detalle: 'Nervios' },
      { orgreg_codigo: 'MUSCULO_ESQUELETICO', detalle: 'Músculo Esquelético' },
      { orgreg_codigo: 'DERMO', detalle: 'Dermo' },
      { orgreg_codigo: 'GENITAL', detalle: 'Genital' },
      { orgreg_codigo: 'MAMAS', detalle: 'Mamas' }
    ];
  }

  private cargarExamenFisico(): void {
    this.cargandoExamenFisico = true;
    this.errorExamenFisico = '';

    // Filtrar por ate_id usando el método getChildTableRecords
    this.authService.getChildTableRecords<OKM_ExamenFisico>(
      'OKM_ATENCION',
      this.ate_id,
      'ate_examenfisico', // Campo en OKM_ATENCION que contiene la tabla hija
      'OKM_EXAMENFISICO'
    ).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.examenFisico = data[0];
          this.modoEdicion = true;
        } else {
          // Crear nuevo registro
          this.examenFisico = {
            parent: this.ate_id,
            parentfield: 'ate_examenfisico',
            parenttype: 'OKM_ATENCION',
            ate_id: this.ate_id,
            exafis_fecha: new Date().toISOString().split('T')[0],
            exafis_hora: new Date().toTimeString().substring(0, 8),
            exafis_detalle: []
          };
          this.modoEdicion = false;
        }
        this.cargandoExamenFisico = false;
      },
      error: (err) => {
        console.error('Error al cargar examen físico:', err);
        this.errorExamenFisico = 'Error al cargar examen físico.';
        this.cargandoExamenFisico = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar examen físico', err);
      }
    });
  }

  // Método para agregar un nuevo detalle
  agregarDetalle(): void {
    if (!this.examenFisico) return;
    
    if (!this.examenFisico.exafis_detalle) {
      this.examenFisico.exafis_detalle = [];
    }
    
    // Agregar un nuevo detalle con valor por defecto
    this.examenFisico.exafis_detalle.push({
      orgreg_codigo: '',
      detexaf_evidencia: ''
    });
  }

  // Método para eliminar un detalle
  eliminarDetalle(index: number): void {
    if (!this.examenFisico || !this.examenFisico.exafis_detalle) return;
    
    this.examenFisico.exafis_detalle.splice(index, 1);
  }

  // Método para obtener el nombre de la región
  getNombreRegion(orgreg_codigo: string): string {
    const region = this.regiones.find(r => r.orgreg_codigo === orgreg_codigo);
    return region ? region.detalle : orgreg_codigo;
  }

  guardar(): void {
    if (!this.examenFisico) {
      this.messageUtils.mostrarError('Error', 'No hay datos para guardar');
      return;
    }

    if (this.modoEdicion) {
      // Actualizar
      this.authService.updateChildRecord<OKM_ExamenFisico>(
        'OKM_EXAMENFISICO',
        this.examenFisico.name!,
        this.examenFisico
      ).subscribe({
        next: (updated) => {
          this.messageUtils.mostrarExito('Examen físico actualizado', 'El registro de examen físico se ha actualizado correctamente.');
          this.cargarExamenFisico(); // Recargar para reflejar cambios
        },
        error: (err) => {
          this.messageUtils.mostrarErrorDeFrappe('Error al actualizar', err);
        }
      });
    } else {
      // Crear
      this.authService.createChildRecord<OKM_ExamenFisico>(
        'OKM_EXAMENFISICO',
        this.examenFisico
      ).subscribe({
        next: (created) => {
          this.messageUtils.mostrarExito('Examen físico creado', 'El registro de examen físico se ha creado correctamente.');
          this.modoEdicion = true;
          this.cargarExamenFisico(); // Recargar para reflejar cambios
        },
        error: (err) => {
          this.messageUtils.mostrarErrorDeFrappe('Error al crear', err);
        }
      });
    }
  }

  cancelar(): void {
    this.cargarExamenFisico();
  }
}