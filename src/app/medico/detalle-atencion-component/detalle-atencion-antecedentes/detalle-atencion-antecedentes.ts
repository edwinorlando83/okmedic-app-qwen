

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OKM_AntObstetrico } from '../../../interfaces/okm-antobstetrico.interface';
import { OKM_AntGinecologico } from '../../../interfaces/okm-antginecologico.interface';
import { OKM_AntOdontologico } from '../../../interfaces/okm-antodontologico.interface';
import { OKM_InformeExaOdon } from '../../../interfaces/okm-informeexaodon.interface';
import { AtencionService } from '../../../services/atencion.service';
import { MessageUtilsService } from '../../../utils/message-utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalleAtencionAntecedentesModalComponent } from '../detalle-atencion-antecedentes-modal-component/detalle-atencion-antecedentes-modal-component';
import { FrappeApiService } from '../../../services/frappe-api.service';

@Component({
  selector: 'app-detalle-atencion-antecedentes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './detalle-atencion-antecedentes.html',
  styleUrl: './detalle-atencion-antecedentes.css'
})
export class DetalleAtencionAntecedentes implements OnInit {
  @Input() ate_id: string = '';

  // Datos para cada tabla hija
  antObstetricos: OKM_AntObstetrico[] = [];
  antGinecologicos: OKM_AntGinecologico[] = [];
  antOdontologicos: OKM_AntOdontologico[] = [];
  informesExaOdon: OKM_InformeExaOdon[] = [];

  // Estados de carga
  cargandoAntObstetricos = false;
  cargandoAntGinecologicos = false;
  cargandoAntOdontologicos = false;
  cargandoInformesExaOdon = false;

  // Estados de error
  errorAntObstetricos = '';
  errorAntGinecologicos = '';
  errorAntOdontologicos = '';
  errorInformesExaOdon = '';

  constructor(
    private authService: AtencionService,
    private messageUtils: MessageUtilsService,
    private modalService: NgbModal,
    private frappeApiService: FrappeApiService
  ) { }

  ngOnInit(): void {
    if (this.ate_id) {
      this.cargarTodosLosAntecedentes();
    } else {
      console.error('No se proporcionó el ID de atención (ate_id)');
      this.messageUtils.mostrarError('Error', 'No se proporcionó el ID de atención.');
    }
  }

  private cargarTodosLosAntecedentes(): void {
    // Cargamos todos los antecedentes a través del padre OKM_ATENCION
    this.cargarAntObstetricos();
    this.cargarAntGinecologicos();
    this.cargarAntOdontologicos();
    this.cargarInformesExaOdon();
  }

  // --- Métodos para cargar datos de tablas hijas a través del padre ---

  private cargarAntObstetricos(): void {
    this.cargandoAntObstetricos = true;
    this.errorAntObstetricos = '';

    this.authService.getAtencionConTablasHijas(this.ate_id).subscribe({
      next: (data) => {
        if (data && data.ate_antobstetricos) {
          this.antObstetricos = data.ate_antobstetricos;
        } else {
          this.antObstetricos = [];
        }
        this.cargandoAntObstetricos = false;
      },
      error: (err) => {
        console.error('Error al cargar antecedentes obstétricos:', err);
        this.errorAntObstetricos = 'Error al cargar antecedentes obstétricos.';
        this.cargandoAntObstetricos = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar antecedentes obstétricos', err);
      }
    });
  }

  private cargarAntGinecologicos(): void {
    this.cargandoAntGinecologicos = true;
    this.errorAntGinecologicos = '';

    this.authService.getAtencionConTablasHijas(this.ate_id).subscribe({
      next: (data) => {
        if (data && data.ate_antginecologicos) {
          this.antGinecologicos = data.ate_antginecologicos;
        } else {
          this.antGinecologicos = [];
        }
        this.cargandoAntGinecologicos = false;
      },
      error: (err) => {
        console.error('Error al cargar antecedentes ginecológicos:', err);
        this.errorAntGinecologicos = 'Error al cargar antecedentes ginecológicos.';
        this.cargandoAntGinecologicos = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar antecedentes ginecológicos', err);
      }
    });
  }

  private cargarAntOdontologicos(): void {
    this.cargandoAntOdontologicos = true;
    this.errorAntOdontologicos = '';

    this.authService.getAtencionConTablasHijas(this.ate_id).subscribe({
      next: (data) => {
        if (data && data.ate_aodontologicos) {
          this.antOdontologicos = data.ate_aodontologicos;
        } else {
          this.antOdontologicos = [];
        }
        this.cargandoAntOdontologicos = false;
      },
      error: (err) => {
        console.error('Error al cargar antecedentes odontológicos:', err);
        this.errorAntOdontologicos = 'Error al cargar antecedentes odontológicos.';
        this.cargandoAntOdontologicos = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar antecedentes odontológicos', err);
      }
    });
  }

  private cargarInformesExaOdon(): void {
    this.cargandoInformesExaOdon = true;
    this.errorInformesExaOdon = '';

    this.authService.getAtencionConTablasHijas(this.ate_id).subscribe({
      next: (data) => {
        if (data && data.infexaodo_informes) {
          this.informesExaOdon = data.infexaodo_informes;
        } else {
          this.informesExaOdon = [];
        }
        this.cargandoInformesExaOdon = false;
      },
      error: (err) => {
        console.error('Error al cargar informes de exámenes odontológicos:', err);
        this.errorInformesExaOdon = 'Error al cargar informes de exámenes odontológicos.';
        this.cargandoInformesExaOdon = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar informes de exámenes odontológicos', err);
      }
    });
  }

  // --- Métodos para abrir modales de edición/creación ---

  abrirModalAntObstetrico(ant?: OKM_AntObstetrico): void {
    const modalRef = this.modalService.open(DetalleAtencionAntecedentesModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.ate_id = this.ate_id;
    modalRef.componentInstance.modoEdicion = !!ant;
    modalRef.componentInstance.tipoAntecedente = 'antObstetrico';
    modalRef.componentInstance.antObstetrico = ant || {};

    modalRef.result.then(() => {
      this.cargarAntObstetricos();
    }, () => { });
  }

  abrirModalAntGinecologico(ant?: OKM_AntGinecologico): void {
    const modalRef = this.modalService.open(DetalleAtencionAntecedentesModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.ate_id = this.ate_id;
    modalRef.componentInstance.modoEdicion = !!ant;
    modalRef.componentInstance.tipoAntecedente = 'antGinecologico';
    modalRef.componentInstance.antGinecologico = ant || {};

    modalRef.result.then(() => {
      this.cargarAntGinecologicos();
    }, () => { });
  }

  abrirModalAntOdontologico(ant?: OKM_AntOdontologico): void {
    const modalRef = this.modalService.open(DetalleAtencionAntecedentesModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.ate_id = this.ate_id;
    modalRef.componentInstance.modoEdicion = !!ant;
    modalRef.componentInstance.tipoAntecedente = 'antOdontologico';
    modalRef.componentInstance.antOdontologico = ant || {};

    modalRef.result.then(() => {
      this.cargarAntOdontologicos();
    }, () => { });
  }

  abrirModalInformeExaOdon(ant?: OKM_InformeExaOdon): void {
    const modalRef = this.modalService.open(DetalleAtencionAntecedentesModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.ate_id = this.ate_id;
    modalRef.componentInstance.modoEdicion = !!ant;
    modalRef.componentInstance.tipoAntecedente = 'informeExaOdon';
    modalRef.componentInstance.informeExaOdon = ant || {};

    modalRef.result.then(() => {
      this.cargarInformesExaOdon();
    }, () => { });
  }

  // --- Métodos para eliminar ---
  eliminarAntObstetrico(ant: OKM_AntObstetrico): void {
    this.messageUtils.mostrarConfirmacion(
      '¿Eliminar antecedente?',
      `¿Está seguro de que desea eliminar este antecedente obstétrico?`,
      'Sí, eliminar',
      'Cancelar'
    ).then(confirmado => {
      if (confirmado) {


        this.frappeApiService
          .deleteChildRecord('OKM_ATENCION', this.ate_id, 'ate_antobstetricos', ant.name)
          .subscribe({
            next: (res: any) => {
              this.messageUtils.mostrarExito('Antecedente eliminado', 'El antecedente obstétrico se ha eliminado correctamente.');
              this.cargarAntObstetricos();
            },
            error: (err: any) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al eliminar', err);
            }
          });




      }
    });
  }

  eliminarAntGinecologico(ant: OKM_AntGinecologico): void {
    this.messageUtils.mostrarConfirmacion(
      '¿Eliminar antecedente?',
      `¿Está seguro de que desea eliminar este antecedente ginecológico?`,
      'Sí, eliminar',
      'Cancelar'
    ).then(confirmado => {
      if (confirmado) {



        this.frappeApiService
          .deleteChildRecord('OKM_ATENCION', this.ate_id, 'ate_antginecologicos', ant.name)
          .subscribe({
            next: (res: any) => {
              this.messageUtils.mostrarExito('Antecedente eliminado', 'El antecedente ginecológico se ha eliminado correctamente.');
              this.cargarAntGinecologicos();
            },
            error: (err: any) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al eliminar', err);
            }
          });





      }
    });
  }

  eliminarAntOdontologico(ant: OKM_AntOdontologico): void {
    this.messageUtils.mostrarConfirmacion(
      '¿Eliminar antecedente?',
      `¿Está seguro de que desea eliminar este antecedente odontológico?`,
      'Sí, eliminar',
      'Cancelar'
    ).then(confirmado => {
      if (confirmado) {


        this.frappeApiService
          .deleteChildRecord('OKM_ATENCION', this.ate_id, 'ate_aodontologicos', ant.name)
          .subscribe({
            next: (res: any) => {
              this.messageUtils.mostrarExito('Antecedente eliminado', 'El antecedente odontológico se ha eliminado correctamente.');
              this.cargarAntOdontologicos();
            },
            error: (err: any) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al eliminar', err);
            }
          });



      }
    });
  }

  eliminarInformeExaOdon(ant: OKM_InformeExaOdon): void {
    this.messageUtils.mostrarConfirmacion(
      '¿Eliminar informe?',
      `¿Está seguro de que desea eliminar este informe de examen odontológico?`,
      'Sí, eliminar',
      'Cancelar'
    ).then(confirmado => {
      if (confirmado) {


       this.frappeApiService
          .deleteChildRecord('OKM_ATENCION', this.ate_id, 'infexaodo_informes', ant.name || '')
          .subscribe({
            next: (res: any) => {
              this.messageUtils.mostrarExito('Informe eliminado', 'El informe de examen odontológico se ha eliminado correctamente.');
            this.cargarInformesExaOdon();
            },
            error: (err: any) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al eliminar', err);
            }
          });

        



      }
    });
  }
}