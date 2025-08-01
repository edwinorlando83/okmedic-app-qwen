// src/app/agenda/agenda.component.ts
import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common'; // Para [ngClass]
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { AgendaService } from '../../services/agenda.service';
import { FrappeApiService } from '../../services/frappe-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PacienteSelectorModalComponent } from '../../components/paciente-selector.component/paciente-selector.component';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, NgFor],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css']
})
export class AgendaComponent {
  activeTab = 'disponibles'; // Pestaña activa por defecto
  selectedDate = new Date().toISOString().split('T')[0]; // Fecha de hoy

  // Datos para la pestaña "Agendas Disponibles"
  atiende: 'SI' | 'NO' = 'SI'; // Valor por defecto
  numeroCitas = 0;
  citasDisponibles: CitaDisponible[] = [];
  cargandoAgenda = false;
  errorAgenda = '';
  constructor(
   
    private authService: AuthService,
    private agendaService: AgendaService,
    private frappeApiService: FrappeApiService,
     private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.cargarAgendaDisponible(); // ✅ Cargar al iniciar

    this.getPacientes();



  }
  getPacientes() {

    this.frappeApiService.list('OKM_PACIENTE', {
      fields: ['name', 'pac_nombrecompleto', 'pac_identificacion', 'pac_fechanac'],

      orderBy: 'pac_nombrecompleto asc',
      limitPageLength: 1000
    }).subscribe(data => {
      console.log('Lista filtrada:', data);
    });
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'disponibles') {
      this.cargarAgendaDisponible(); // ✅ Recargar si se vuelve a la pestaña
    }
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    console.log('Fecha seleccionada:', this.selectedDate);
    if (this.activeTab === 'disponibles') {
      this.cargarAgendaDisponible(); // ✅ Recargar al cambiar fecha en la pestaña correcta
    }
  }

  private cargarAgendaDisponible(): void {
    this.cargandoAgenda = true;
    this.errorAgenda = '';

    const idProfesional = this.authService.getProfesionalId();
    const codigoUnidad = this.authService.getUnidadMedicaCodigo();

    if (!idProfesional || !codigoUnidad) {
      this.errorAgenda = 'No se encontraron datos del profesional o unidad médica. Por favor, inicie sesión nuevamente.';
      this.cargandoAgenda = false;
      return;
    }

    this.agendaService.getAgendaDoctor(
      idProfesional,
      codigoUnidad,
      this.selectedDate
    ).subscribe({
      next: (response) => {
        console.log('Respuesta de agenda:', response);
        this.atiende = response.message.atiende;
        this.numeroCitas = response.message.numero_citas;
        this.citasDisponibles = response.message.citas || [];
        this.cargandoAgenda = false;
      },
      error: (err) => {
        console.error('Error al cargar la agenda:', err);
        this.errorAgenda = 'Error al cargar la agenda. Por favor, intente nuevamente.';
        this.cargandoAgenda = false;
        this.atiende = 'SI'; // Resetear valores
        this.numeroCitas = 0;
        this.citasDisponibles = [];
      }
    });
  }

  asignarCita(cita: CitaDisponible): void {
    console.log('Asignar cita:', cita.name);
    alert(`Funcionalidad para asignar cita ${cita.name} aún no implementada.`);
    // Aquí iría la lógica para asignar la cita
  }

  ajustarBrilloColor(color: string, porcentaje: number): string {
    if (!color || !color.startsWith('#')) return color;

    // Convertir hex a RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Ajustar brillo
    r = Math.min(255, Math.max(0, r + porcentaje));
    g = Math.min(255, Math.max(0, g + porcentaje));
    b = Math.min(255, Math.max(0, b + porcentaje));

    // Convertir de vuelta a hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Función auxiliar para determinar si el texto debe ser negro
  necesitaTextoNegro(color: string): boolean {
    if (!color || !color.startsWith('#')) return false;

    // Convertir hex a RGB
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    // Calcular luminosidad
    const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminosidad > 0.7;
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  abrirSelectorPacientes(): void {
    const modalRef = this.modalService.open(PacienteSelectorModalComponent, {
      size: 'lg', // Tamaño grande para mejor visualización
      backdrop: 'static', // Evita que se cierre haciendo clic fuera
      keyboard: false // Evita que se cierre con ESC
    });

    modalRef.result.then(
      (pacienteSeleccionado: Paciente) => {
       
        console.log('Paciente seleccionado:', pacienteSeleccionado);
        // Aquí puedes llamar a tu servicio para agendar la cita
        this.agendarCitaParaPaciente(pacienteSeleccionado);
      },
      (dismissedReason) => {
        console.log('Modal cerrado sin seleccionar paciente:', dismissedReason);
      }
    );
  }

  private agendarCitaParaPaciente(paciente: Paciente): void {
    // Lógica para agendar cita con el paciente seleccionado
    console.log('Agendando cita para:', paciente.name);
     alert(paciente.name);
    // Llamar a tu servicio de agenda con el ID del paciente
  }
}