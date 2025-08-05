import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { OKM_Paciente } from '../../interfaces/okm-paciente.interface';
import { MessageUtilsService } from '../../utils/message-utils.service';
import { forkJoin } from 'rxjs';
 

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './paciente-form-component.html',
  styleUrls: ['./paciente-form-component.css']
})
export class PacienteFormComponent implements OnInit {
  pacienteId: string | null = null;
  paciente: Partial<OKM_Paciente> = {
    pac_pnombre: '',
    pac_snombre: '',
    pac_papellido: '',
    pac_sapellido: '',
    pac_nombrecompleto: '',
    pac_identificacion: '',
    sex_codigo: '',
    lat_codigo: '',
    estciv_codigo: '',
    pac_fechanac: '',
    pac_nacionalidad: '',
    pai_codigo: '',
    provincia: '',
    canton: '',
    parroquia: '',
    pac_celular: '',
    pac_telefono: '',
    pac_email: '',
    // Inicializar arrays para tablas hijas
    pac_alertas: [],
    pac_infoadicional: [],
    pac_parientes: []
  };
  isNew = true;
  cargando = false;
  error = '';
  lateralidades: { lat_codigo: string; lat_desc: string }[] = [];

  // Datos maestros
  tiposIdentificacion: any[] = [];
  sexos: any[] = [];
  estadosCiviles: any[] = [];
  paises: any[] = [];
  provincias: string[] = [];
  cantones: string[] = [];
  parroquias: string[] = [];

  constructor(
    private pacienteService: PacienteService,
    private messageUtils: MessageUtilsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.pacienteId = id;
        this.isNew = false;
        this.cargarPaciente(id);
      } else {
        this.isNew = true;
        // Cargar datos por defecto si es nuevo
        this.paciente.pai_codigo = 'ECU'; // Ecuador por defecto según el script
        this.paciente.pac_nacionalidad = 'Ecuatoriano';
      }
    });

    this.cargarDatosMaestros();
  }

  private cargarPaciente(id: string): void {
    this.cargando = true;
    this.error = '';
    this.pacienteService.getPaciente(id).subscribe({
      next: (data) => {
        if (data) {
          this.paciente = data;
          console.log('Paciente cargado:', this.paciente); // Para depuración

          // Cargar datos de ubicación si existen
          // 1. Si ya hay una provincia guardada, cargar los cantones para esa provincia
          if (this.paciente.provincia) {
            console.log('Cargando cantones para la provincia guardada:', this.paciente.provincia);
            this.pacienteService.getCantones(this.paciente.provincia).subscribe(cantones => {
              this.cantones = cantones;
              console.log('Cantones cargados:', this.cantones);

              // 2. Si ya hay un cantón guardado, cargar las parroquias para esa provincia y cantón
              if (this.paciente.canton) {
                console.log('Cargando parroquias para la provincia y cantón guardados:', this.paciente.provincia, this.paciente.canton);
                this.pacienteService.getParroquias(this.paciente.provincia || '' , this.paciente.canton).subscribe(parroquias => {
                  this.parroquias = parroquias;
                  console.log('Parroquias cargadas:', this.parroquias);
                });
              }
            });
          }
        } else {
          this.error = 'No se encontró el paciente.';
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar paciente:', err);
        this.error = 'Error al cargar los datos del paciente.';
        this.cargando = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al cargar paciente', err);
      }
    });
  }

  private cargarDatosMaestros(): void {
    // Cargar todos los datos maestros en paralelo
    forkJoin([
      this.pacienteService.getTiposIdentificacion(),
      this.pacienteService.getSexos(),
      this.pacienteService.getEstadosCiviles(),
      this.pacienteService.getPaises(),
       this.pacienteService.getLateralidades(),
      this.pacienteService.getProvincias()
    ]).subscribe({
      next: ([tiposId, sexos, estadosCiv, paises,lateralidades, provincias]) => {
        this.tiposIdentificacion = tiposId;
        this.sexos = sexos;
        this.estadosCiviles = estadosCiv;
        this.paises = paises;
        this.lateralidades = lateralidades; 
        this.provincias = provincias;
      },
      error: (err:any) => {
        console.error('Error al cargar datos maestros:', err);
        this.messageUtils.mostrarError('Error', 'No se pudieron cargar todos los datos maestros.');
      }
    });
  }

  onProvinciaChange(): void {
    console.log('Provincia cambiada a:', this.paciente.provincia); // Para depuración
    if (this.paciente.provincia) {
      this.paciente.canton = '';
      this.paciente.parroquia = '';
      this.cantones = [];
      this.parroquias = [];
      this.pacienteService.getCantones(this.paciente.provincia).subscribe(cantones => {
        this.cantones = cantones;
        console.log('Cantones cargados tras cambio de provincia:', this.cantones); // Para depuración
      });
    } else {
      // Si se limpia la provincia, limpiar también cantón y parroquia
      this.paciente.canton = '';
      this.paciente.parroquia = '';
      this.cantones = [];
      this.parroquias = [];
    }
  }

  onCantonChange(): void {
    console.log('Cantón cambiado a:', this.paciente.canton); // Para depuración
    if (this.paciente.provincia && this.paciente.canton) {
      this.paciente.parroquia = '';
      this.parroquias = [];
      this.pacienteService.getParroquias(this.paciente.provincia, this.paciente.canton).subscribe(parroquias => {
        this.parroquias = parroquias;
        console.log('Parroquias cargadas tras cambio de cantón:', this.parroquias); // Para depuración
      });
    } else {
      // Si se limpia el cantón, limpiar también la parroquia
      this.paciente.parroquia = '';
      this.parroquias = [];
    }
  }

  onParroquiaChange(): void {
    if (this.paciente.provincia && this.paciente.canton && this.paciente.parroquia) {
      this.pacienteService.getDpaCode(this.paciente.provincia, this.paciente.canton, this.paciente.parroquia).subscribe(dpaCode => {
        // Asignar el código DPA si es necesario
        // this.paciente.pac_dpanacimiento = dpaCode; // Si existe este campo
      });
    }
  }

  onIdentificacionChange(): void {
    const identificacion = this.paciente.pac_identificacion;
    if (identificacion && this.isNew && (identificacion.length === 10 || identificacion.length === 13)) {
      // Determinar tipo de identificación
      if (identificacion.length === 10) {
        this.paciente.tipide_codigo = 'C'; // Cédula
      } else if (identificacion.length === 13) {
        this.paciente.tipide_codigo = 'R'; // RUC
      }

      // Llamar al servicio para obtener datos
      this.pacienteService.getDataByIdentification(identificacion).subscribe({
        next: (response) => {
          if (response && response.message && response.message.data) {
            const data = response.message.data;
            // Mapear datos obtenidos a campos del paciente
            this.paciente.pac_papellido = data.firstLastName || '';
            this.paciente.pac_sapellido = data.secondLastName || '';
            
            const nombres = data.names ? data.names.split(' ') : [];
            this.paciente.pac_pnombre = nombres[0] || '';
            this.paciente.pac_snombre = nombres.slice(1).join(' ') || '';
            
            this.paciente.sex_codigo = data.gender === 'Masculino' ? '1' : '2'; // Ajustar según tus códigos
            
            if (data.birthDate) {
              this.paciente.pac_fechanac = data.birthDate; // Asegúrate del formato de fecha
            }
            
            // Mapear estado civil si es necesario
            // ...
            
            // Refrescar la vista si es necesario
            // this.ref.detectChanges(); // Si usas ChangeDetectorRef
          }
        },
        error: (err) => {
          console.error('Error al obtener datos por identificación:', err);
          // No mostrar error al usuario, ya que puede ser un número no encontrado
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isNew) {
      this.crearPaciente();
    } else {
      this.actualizarPaciente();
    }
  }

  private crearPaciente(): void {
    this.cargando = true;
    this.error = '';
    this.pacienteService.createPaciente(this.paciente).subscribe({
      next: (nuevoPaciente) => {
        this.cargando = false;
        this.messageUtils.mostrarExito('Paciente creado', `El paciente ${nuevoPaciente.pac_nombrecompleto} ha sido creado exitosamente.`);
        // Redirigir a la lista o al detalle
        this.router.navigate(['/pacientes', nuevoPaciente.name]);
      },
      error: (err) => {
        console.error('Error al crear paciente:', err);
        this.error = 'Error al crear el paciente.';
        this.cargando = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al crear paciente', err);
      }
    });
  }

  private actualizarPaciente(): void {
    if (!this.pacienteId) return;

    this.cargando = true;
    this.error = '';
    // Solo enviar los campos que han cambiado o son requeridos
    const datosAEnviar = { ...this.paciente }; // O implementar lógica de cambios
    this.pacienteService.updatePaciente(this.pacienteId, datosAEnviar).subscribe({
      next: (pacienteActualizado) => {
        this.cargando = false;
        this.messageUtils.mostrarExito('Paciente actualizado', `Los datos del paciente han sido actualizados exitosamente.`);
        // Opcional: Recargar datos
        // this.cargarPaciente(this.pacienteId);
      },
      error: (err) => {
        console.error('Error al actualizar paciente:', err);
        this.error = 'Error al actualizar el paciente.';
        this.cargando = false;
        this.messageUtils.mostrarErrorDeFrappe('Error al actualizar paciente', err);
      }
    });
  }

  cancelar(): void {
    if (this.pacienteId) {
      this.router.navigate(['/pacientes', this.pacienteId]);
    } else {
      this.router.navigate(['/pacientes']);
    }
  }
}