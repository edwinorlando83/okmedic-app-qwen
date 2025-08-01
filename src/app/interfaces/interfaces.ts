// En src/app/agenda/agenda.component.ts, al inicio, junto a otras interfaces

interface CitaDisponible {
  name: string; // ID de la agenda
  estcit_color: string; // Color del estado
  estcit_descripcion: string; // Descripción del estado
  age_fechacita: string; // Fecha
  age_hinicio: string; // Hora inicio
  age_hfin: string; // Hora fin
  age_duracion: number; // Duración en minutos
  mod_descripcion: string; // Modalidad (PRESENCIAL, etc.)
  prosal_nombrecompleto: string; // Nombre del profesional
  psxum_codigo: string; // Código combinado Profesional/Unidad
}

interface RespuestaAgendaDoctor {
  message: {
    atiende: 'SI' | 'NO';
    numero_citas: number;
    citas: CitaDisponible[];
  };
}

interface Paciente {
  name: string;
  pac_nombrecompleto: string;
  pac_identificacion: string;
  pac_fechanac: string;
}
