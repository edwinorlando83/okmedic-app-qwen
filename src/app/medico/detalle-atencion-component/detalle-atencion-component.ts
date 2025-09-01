// src/app/atencion-medica/detalle-atencion/detalle-atencion.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DetalleAtencionHistorial } from './detalle-atencion-historial/detalle-atencion-historial';
import { DetalleAtencionLugarAtencion } from './detalle-atencion-lugar-atencion/detalle-atencion-lugar-atencion';
import { DetalleAtencionMotivoConsulta } from './detalle-atencion-motivo-consulta/detalle-atencion-motivo-consulta';
import { DetalleAtencionAntecedentes } from './detalle-atencion-antecedentes/detalle-atencion-antecedentes';
import { DetalleAtencionSignosVitales } from './detalle-atencion-signos-vitales/detalle-atencion-signos-vitales';
import { DetalleAtencionRevicionSistemas } from './detalle-atencion-revicion-sistemas/detalle-atencion-revicion-sistemas';
import { DetalleAtencionExamenFisco } from './detalle-atencion-examen-fisco/detalle-atencion-examen-fisco';
import { DetalleAtencionEvolucion } from './detalle-atencion-evolucion/detalle-atencion-evolucion';
import { DetalleAtencionDiagnostico } from './detalle-atencion-diagnostico/detalle-atencion-diagnostico';
import { DetalleAtencionTratamiento } from './detalle-atencion-tratamiento/detalle-atencion-tratamiento';
import { DetalleAtencionConsentimiento } from './detalle-atencion-consentimiento/detalle-atencion-consentimiento';
import { DetalleAtencionProcedimiento } from './detalle-atencion-procedimiento/detalle-atencion-procedimiento';
import { DetalleAtencionCertificado } from './detalle-atencion-certificado/detalle-atencion-certificado';
 
import { AtencionService } from '../../services/atencion.service';
import { MessageUtilsService } from '../../utils/message-utils.service';

@Component({
  selector: 'app-detalle-atencion',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    DetalleAtencionHistorial,
    DetalleAtencionLugarAtencion,
    DetalleAtencionMotivoConsulta,
    DetalleAtencionAntecedentes,
    DetalleAtencionSignosVitales,
    DetalleAtencionRevicionSistemas,
    DetalleAtencionExamenFisco,
    DetalleAtencionEvolucion,
    DetalleAtencionDiagnostico,
    DetalleAtencionTratamiento,
    DetalleAtencionConsentimiento,
    DetalleAtencionProcedimiento,
    DetalleAtencionCertificado,
     
  ],
 templateUrl: './detalle-atencion-component.html',
  styleUrl: './detalle-atencion-component.css'
})
export class DetalleAtencionComponent   {
  @Input() ate_id: string = ''; // Recibimos el ID de la atención como input

  activeTab = 'historial'; // Pestaña activa por defecto


  // Datos combinados del paciente y médico (de la nueva API)
  infoPacienteDoctor: any = null; // Puedes tiparlo mejor con una interfaz si la defines
  cargandoInfo = false;
  errorInfo = '';



  paciente = {
    nombre: 'María González Pérez',
    cedula: '12.345.678',
    edad: '45 años',
    telefono: '+58 412-1234567'
  };

  medico = {
    nombre: 'Dr. Carlos Rodríguez',
    especialidad: 'Medicina Interna',
    registro: 'MPPS-54321',
    fecha: '15/01/2024'
  };

  tabs = [
    { id: 'historial', label: 'Historial', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'lugar-atencion', label: 'Lugar de Atención', icon: 'M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' },
    { id: 'motivo-consulta', label: 'Motivo de Consulta', icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z' },
    { id: 'antecedentes', label: 'Antecedentes', icon: 'M4 3a2 2 0 100 4h12a2 2 0 100-4H4z' },
    { id: 'signos-vitales', label: 'Signos Vitales', icon: 'M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z' },
    { id: 'revision-sistemas', label: 'Revisión de Sistemas', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'examen-fisico', label: 'Examen Físico', icon: 'M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z' },
    { id: 'diagnostico', label: 'Diagnóstico', icon: 'M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' },
    { id: 'consentimiento', label: 'Consentimiento', icon: 'M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z' },
    { id: 'tratamiento', label: 'Tratamiento', icon: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' },
    { id: 'procedimiento', label: 'Procedimiento', icon: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' }, // Icono repetido, puedes cambiarlo
    { id: 'evolucion', label: 'Evolución', icon: 'M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z' },
    { id: 'certificado', label: 'Certificado Médico', icon: 'M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z' }
  ];

  constructor(private router: Router, private route: ActivatedRoute,
 private atencionService: AtencionService,
     private messageUtils: MessageUtilsService
  ) { }

  ngOnInit(): void {
    // Si se pasa el ate_id como parámetro de ruta, lo usamos
    this.route.paramMap.subscribe(params => {
      const id = params.get('ate_id');
      if (id) {
        this.ate_id = id;
        // Cargar la información combinada del paciente y médico
        this.cargarInfoPacienteDoctor(id);
      } else if (this.ate_id) {
        // Si se pasa como @Input
        this.cargarInfoPacienteDoctor(this.ate_id);
      } else {
        this.errorInfo = 'No se proporcionó el ID de atención.';
        this.messageUtils.mostrarError('Error', this.errorInfo);
      }
    });
  }


   private cargarInfoPacienteDoctor(id: string): void {
    this.cargandoInfo = true;
    this.errorInfo = '';
    console.log(`Cargando info paciente-doctor para atención: ${id}`);

    this.atencionService.getInfoPacienteDoctor(id).subscribe({
      next: (data) => {
        console.log('Info paciente-doctor cargada:', data);
        this.infoPacienteDoctor = data;
        this.cargandoInfo = false;
      },
      error: (err) => {
        console.error('Error al cargar info paciente-doctor:', err);
        this.errorInfo = 'Error al cargar la información del paciente y médico.';
        this.cargandoInfo = false;
        // El mensaje de error ya se muestra en el servicio
        // this.messageUtils.mostrarErrorDeFrappe('Error al cargar info', err);
      }
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

 formatearFecha(fechaStr: string): string {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return isNaN(fecha.getTime()) ? fechaStr : fecha.toLocaleDateString('es-EC');
  }

  calcularEdad(fechaNacStr: string): number | null {
    if (!fechaNacStr) return null;
    const hoy = new Date();
    const fechaNac = new Date(fechaNacStr);
    if (isNaN(fechaNac.getTime())) return null;

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad >= 0 ? edad : null;
  }
}