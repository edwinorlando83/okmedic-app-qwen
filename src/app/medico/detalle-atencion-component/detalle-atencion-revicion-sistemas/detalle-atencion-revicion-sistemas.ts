import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OKM_RevisionOrgsis, OKM_DetRevision } from '../../../interfaces/okm-revisionorgsis.interface';
import { AtencionService } from '../../../services/atencion.service';
import { MessageUtilsService } from '../../../utils/message-utils.service';

@Component({
  selector: 'app-detalle-atencion-revicion-sistemas',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './detalle-atencion-revicion-sistemas.html',
  styleUrl: './detalle-atencion-revicion-sistemas.css'

})
export class DetalleAtencionRevicionSistemas implements OnInit {
  @Input() ate_id: string = '';

  // Datos de revisión de sistemas
  revisionSistemas: OKM_RevisionOrgsis | null = null;
  cargandoRevisionSistemas = false;
  errorRevisionSistemas = '';
  modoEdicion = false;

  // Lista de órganos/sistemas para el detalle
  organosSistemas: any[] = [];

  constructor(
    private authService: AtencionService,
    private messageUtils: MessageUtilsService
  ) { }

  ngOnInit(): void {
    if (this.ate_id) {
      this.cargarRevisionSistemas();
      this.cargarOrganosSistemas();
    } else {
      console.error('No se proporcionó el ID de atención (ate_id)');
      this.messageUtils.mostrarError('Error', 'No se proporcionó el ID de atención.');
    }
  }

  private cargarOrganosSistemas(): void {
    // Cargar lista de órganos/sistemas disponibles
    // Esta sería una llamada real al servicio, pero por ahora dejamos vacío
    // En una implementación real, cargarías desde OKM_ORGANOSISTEMA
    this.organosSistemas = [
      { orgsis_codigo: 'CARD', orgsis_desc: 'Cardiovascular' },
      { orgsis_codigo: 'RESP', orgsis_desc: 'Respiratorio' },
      { orgsis_codigo: 'DIG', orgsis_desc: 'Digestivo' },
      { orgsis_codigo: 'GEN', orgsis_desc: 'Genitourinario' },
      { orgsis_codigo: 'END', orgsis_desc: 'Endocrino' },
      { orgsis_codigo: 'NEU', orgsis_desc: 'Neurológico' },
      { orgsis_codigo: 'MUS', orgsis_desc: 'Musculoesquelético' },
      { orgsis_codigo: 'PIEL', orgsis_desc: 'Piel' },
      { orgsis_codigo: 'MENT', orgsis_desc: 'Mental' },
      { orgsis_codigo: 'OTROS', orgsis_desc: 'Otros' }
    ];
  }

  private cargarRevisionSistemas(): void {
    this.cargandoRevisionSistemas = true;
    this.errorRevisionSistemas = '';

    // Filtrar por ate_id usando el método getChildTableRecords
    this.authService.getChildTableRecords<OKM_RevisionOrgsis>(
      'OKM_ATENCION',
      this.ate_id,
      'ate_revisionorgsis', // Campo en OKM_ATENCION que contiene la tabla hija
      'OKM_REVISIONORGSIS'
    ).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.revisionSistemas = data[0];
          this.modoEdicion = true;
        } else {
          // Crear nuevo registro
          this.revisionSistemas = {
            parent: this.ate_id,
            parentfield: 'ate_revisionorgsis',
            parenttype: 'OKM_ATENCION',
            ate_id: this.ate_id,
            revorgsis_detalle: []
          };
          this.modoEdicion = false;
        }
        this.cargandoRevisionSistemas = false;
      },
      error: (err) => {
        console.error('Error al cargar revisión de sistemas:', err);
        this.errorRevisionSistemas = 'Error al cargar revisión de sistemas.';
        this.cargandoRevisionSistemas = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar revisión de sistemas', err);
      }
    });
  }

  // Método para agregar un nuevo detalle
  agregarDetalle(): void {
    if (!this.revisionSistemas) return;
    
    if (!this.revisionSistemas.revorgsis_detalle) {
      this.revisionSistemas.revorgsis_detalle = [];
    }
    
    // Agregar un nuevo detalle con valor por defecto
    this.revisionSistemas.revorgsis_detalle.push({
      orgsis_codigo: '',
      detrev_evidencia: ''
    });
  }

  // Método para eliminar un detalle
  eliminarDetalle(index: number): void {
    if (!this.revisionSistemas || !this.revisionSistemas.revorgsis_detalle) return;
    
    this.revisionSistemas.revorgsis_detalle.splice(index, 1);
  }

  // Método para obtener el nombre del órgano/sistema
  getNombreOrgano(orgsis_codigo: string): string {
    const organo = this.organosSistemas.find(o => o.orgsis_codigo === orgsis_codigo);
    return organo ? organo.orgsis_desc : orgsis_codigo;
  }

  guardar(): void {
    if (!this.revisionSistemas) {
      this.messageUtils.mostrarError('Error', 'No hay datos para guardar');
      return;
    }

    if (this.modoEdicion) {
      // Actualizar
      this.authService.updateChildRecord<OKM_RevisionOrgsis>(
        'OKM_REVISIONORGSIS',
        this.revisionSistemas.name!,
        this.revisionSistemas
      ).subscribe({
        next: (updated) => {
          this.messageUtils.mostrarExito('Revisión de sistemas actualizada', 'El registro de revisión de sistemas se ha actualizado correctamente.');
          this.cargarRevisionSistemas(); // Recargar para reflejar cambios
        },
        error: (err) => {
          this.messageUtils.mostrarErrorDeFrappe('Error al actualizar', err);
        }
      });
    } else {
      // Crear
      this.authService.createChildRecord<OKM_RevisionOrgsis>(
        'OKM_REVISIONORGSIS',
        this.revisionSistemas
      ).subscribe({
        next: (created) => {
          this.messageUtils.mostrarExito('Revisión de sistemas creada', 'El registro de revisión de sistemas se ha creado correctamente.');
          this.modoEdicion = true;
          this.cargarRevisionSistemas(); // Recargar para reflejar cambios
        },
        error: (err) => {
          this.messageUtils.mostrarErrorDeFrappe('Error al crear', err);
        }
      });
    }
  }

  cancelar(): void {
    this.cargarRevisionSistemas();
  }
}