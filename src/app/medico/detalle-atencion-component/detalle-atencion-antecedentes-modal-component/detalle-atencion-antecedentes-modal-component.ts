import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OKM_AntObstetrico } from '../../../interfaces/okm-antobstetrico.interface';
import { OKM_AntGinecologico } from '../../../interfaces/okm-antginecologico.interface';
import { OKM_AntOdontologico } from '../../../interfaces/okm-antodontologico.interface';
import { OKM_InformeExaOdon } from '../../../interfaces/okm-informeexaodon.interface';
import { AtencionService } from '../../../services/atencion.service';
import { MessageUtilsService } from '../../../utils/message-utils.service';
import { NgFor, NgIf } from '@angular/common';
import { FrappeApiService } from '../../../services/frappe-api.service';

// Interfaces para los datos relacionados
interface MetodoAnticonceptivo {
  metant_codigo: string;
  metant_desc: string;
}

interface TipoAntecedenteOdontologico {
  tipaodo_codigo: string;
  tipaodo_desc: string;
}

interface ExamenOdontologico {
  exaodo_codigo: string;
  exaodo_desc: string;
}

@Component({
  selector: 'app-detalle-atencion-antecedentes-modal',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './detalle-atencion-antecedentes-modal-component.html',
  styleUrl: './detalle-atencion-antecedentes-modal-component.css'
})
export class DetalleAtencionAntecedentesModalComponent implements OnInit {
  @Input() ate_id!: string;
  @Input() modoEdicion!: boolean;
  @Input() tipoAntecedente!: string; // 'antObstetrico', 'antGinecologico', 'antOdontologico', 'informeExaOdon'
  
  @Input() antObstetrico: any = {};
  @Input() antGinecologico: any = {};
  @Input() antOdontologico: any = {};
  @Input() informeExaOdon: any = {};

  // Variables para almacenar los valores de las tablas relacionadas
  metodosAnticonceptivos: MetodoAnticonceptivo[] = [];
  tiposAntecedentesOdontologicos: TipoAntecedenteOdontologico[] = [];
  examenesOdontologicos: ExamenOdontologico[] = [];
  sexos: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AtencionService,
    private messageUtils: MessageUtilsService,
    private frappeApiService: FrappeApiService
  ) {}

  ngOnInit(): void {
    // Cargar los datos necesarios para los campos de tipo Link
    this.cargarDatosRelacionados();
    
    // Inicializar el objeto base con los campos requeridos
    switch(this.tipoAntecedente) {
      case 'antObstetrico':
        if (!this.antObstetrico.parent) {
          this.antObstetrico = {
            ...this.antObstetrico,
            parent: this.ate_id,
            parentfield: 'ate_antobstetricos',
            parenttype: 'OKM_ATENCION'
          };
        }
        break;
      case 'antGinecologico':
        if (!this.antGinecologico.parent) {
          this.antGinecologico = {
            ...this.antGinecologico,
            parent: this.ate_id,
            parentfield: 'ate_antginecologicos',
            parenttype: 'OKM_ATENCION'
          };
        }
        break;
      case 'antOdontologico':
        if (!this.antOdontologico.parent) {
          this.antOdontologico = {
            ...this.antOdontologico,
            parent: this.ate_id,
            parentfield: 'ate_aodontologicos',
            parenttype: 'OKM_ATENCION'
          };
        }
        break;
      case 'informeExaOdon':
        if (!this.informeExaOdon.parent) {
          this.informeExaOdon = {
            ...this.informeExaOdon,
            parent: this.ate_id,
            parentfield: 'infexaodo_informes',
            parenttype: 'OKM_ATENCION'
          };
        }
        break;
    }
  }

  // Método para cargar los datos relacionados
  private cargarDatosRelacionados(): void {
    // Cargar métodos anticonceptivos
    this.frappeApiService.list<MetodoAnticonceptivo>('OKM_METODOANTICONCEPTIVO', {
      fields: ['metant_codigo', 'metant_desc'],
      orderBy: 'metant_desc asc'
    }).subscribe({
      next: (data) => {
        console.log('Metodos anticonceptivos:', data);
        this.metodosAnticonceptivos = data;
      },
      error: (error) => {
        console.error('Error al cargar métodos anticonceptivos:', error);
      }
    });

    // Cargar tipos de antecedentes odontológicos
    this.frappeApiService.list<TipoAntecedenteOdontologico>('OKM_TIPOAODON', {
      fields: ['tipaodo_codigo', 'tipaodo_desc'],
      orderBy: 'tipaodo_desc asc'
    }).subscribe({
      next: (data) => {
        this.tiposAntecedentesOdontologicos = data;
      },
      error: (error) => {
        console.error('Error al cargar tipos de antecedentes odontológicos:', error);
      }
    });

    // Cargar exámenes odontológicos
    this.frappeApiService.list<ExamenOdontologico>('OKM_EXAMENODONTO', {
      fields: ['exaodo_codigo', 'exaodo_desc'],
      orderBy: 'exaodo_desc asc'
    }).subscribe({
      next: (data) => {
        this.examenesOdontologicos = data;
        console.log('Exámenes odontológicos:', data);
      },
      error: (error) => {
        console.error('Error al cargar exámenes odontológicos:', error);
      }
    });

    // Cargar sexos
    this.frappeApiService.list<any>('OKM_SEXO', {
      fields: ['sex_codigo', 'sex_desc'],
      orderBy: 'sex_desc asc'
    }).subscribe({
      next: (data) => {
        this.sexos = data;
      },
      error: (error) => {
        console.error('Error al cargar sexos:', error);
      }
    });
  }

  get tituloModal(): string {
    switch(this.tipoAntecedente) {
      case 'antObstetrico': return this.modoEdicion ? 'Editar Antecedente Obstétrico' : 'Agregar Antecedente Obstétrico';
      case 'antGinecologico': return this.modoEdicion ? 'Editar Antecedente Ginecológico' : 'Agregar Antecedente Ginecológico';
      case 'antOdontologico': return this.modoEdicion ? 'Editar Antecedente Odontológico' : 'Agregar Antecedente Odontológico';
      case 'informeExaOdon': return this.modoEdicion ? 'Editar Informe de Examen Odontológico' : 'Agregar Informe de Examen Odontológico';
      default: return 'Editar Antecedente';
    }
  }

  guardar(): void {
    switch(this.tipoAntecedente) {
      case 'antObstetrico':
        if (this.modoEdicion) {
          this.authService.updateChildRecord<OKM_AntObstetrico>(
            'OKM_ANTOBSTETRICO',
            this.antObstetrico.name!,
            this.antObstetrico
          ).subscribe({
            next: (updated) => {
              this.messageUtils.mostrarExito('Antecedente actualizado', 'El antecedente obstétrico se ha actualizado correctamente.');
              this.activeModal.close();
            },
            error: (err) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al actualizar', err);
            }
          });
        } else {
          this.authService.createChildRecord<OKM_AntObstetrico>(
            'OKM_ANTOBSTETRICO',
            this.antObstetrico
          ).subscribe({
            next: (created) => {
              this.messageUtils.mostrarExito('Antecedente creado', 'El antecedente obstétrico se ha creado correctamente.');
              this.activeModal.close();
            },
            error: (err) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al crear', err);
            }
          });
        }
        break;
        
      case 'antGinecologico':
        if (this.modoEdicion) {
          this.authService.updateChildRecord<OKM_AntGinecologico>(
            'OKM_ANTGINECOLOGICO',
            this.antGinecologico.name!,
            this.antGinecologico
          ).subscribe({
            next: (updated) => {
              this.messageUtils.mostrarExito('Antecedente actualizado', 'El antecedente ginecológico se ha actualizado correctamente.');
              this.activeModal.close();
            },
            error: (err) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al actualizar', err);
            }
          });
        } else {
          this.authService.createChildRecord<OKM_AntGinecologico>(
            'OKM_ANTGINECOLOGICO',
            this.antGinecologico
          ).subscribe({
            next: (created) => {
              this.messageUtils.mostrarExito('Antecedente creado', 'El antecedente ginecológico se ha creado correctamente.');
              this.activeModal.close();
            },
            error: (err) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al crear', err);
            }
          });
        }
        break;
        
      case 'antOdontologico':
        if (this.modoEdicion) {
          this.authService.updateChildRecord<OKM_AntOdontologico>(
            'OKM_ANTODONTOLOGICO',
            this.antOdontologico.name!,
            this.antOdontologico
          ).subscribe({
            next: (updated) => {
              this.messageUtils.mostrarExito('Antecedente actualizado', 'El antecedente odontológico se ha actualizado correctamente.');
              this.activeModal.close();
            },
            error: (err) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al actualizar', err);
            }
          });
        } else {
          this.authService.createChildRecord<OKM_AntOdontologico>(
            'OKM_ANTODONTOLOGICO',
            this.antOdontologico
          ).subscribe({
            next: (created) => {
              this.messageUtils.mostrarExito('Antecedente creado', 'El antecedente odontológico se ha creado correctamente.');
              this.activeModal.close();
            },
            error: (err) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al crear', err);
            }
          });
        }
        break;
        
      case 'informeExaOdon':
        if (this.modoEdicion) {
          this.authService.updateChildRecord<OKM_InformeExaOdon>(
            'OKM_INFORMEEXAODON',
            this.informeExaOdon.name!,
            this.informeExaOdon
          ).subscribe({
            next: (updated) => {
              this.messageUtils.mostrarExito('Informe actualizado', 'El informe de examen odontológico se ha actualizado correctamente.');
              this.activeModal.close();
            },
            error: (err) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al actualizar', err);
            }
          });
        } else {
          this.authService.createChildRecord<OKM_InformeExaOdon>(
            'OKM_INFORMEEXAODON',
            this.informeExaOdon
          ).subscribe({
            next: (created) => {
              this.messageUtils.mostrarExito('Informe creado', 'El informe de examen odontológico se ha creado correctamente.');
              this.activeModal.close();
            },
            error: (err) => {
              this.messageUtils.mostrarErrorDeFrappe('Error al crear', err);
            }
          });
        }
        break;
    }
  }

  cerrarModal(): void {
    this.activeModal.dismiss();
  }
}