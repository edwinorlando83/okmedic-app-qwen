// En src/app/agenda/agenda.component.ts, al inicio, junto a otras interfaces

export interface CitaDisponible {
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

export interface RespuestaAgendaDoctor {
  message: {
    atiende: 'SI' | 'NO';
    numero_citas: number;
    citas: CitaDisponible[];
  };
}


export interface Paciente {
  name: string;
  pac_nombrecompleto: string;
  pac_identificacion: string;
  pac_fechanac: string;
}
export interface CitaProgramada {
  name: string;
  estcit_color: string;
  estcit_descripcion: string;
  age_fechacita: string;
  age_hinicio: string;
  age_hfin: string;
  age_duracion: number;
  mod_descripcion: string;
  prosal_nombrecompleto: string;
  psxum_codigo: string;
  pac_nombrecompleto: string;
  pac_fotoini: string | null;
  paciente_name: string;
  pac_email: string;
  pac_telefono: string | null;
  pac_celular: string;
  signosvitales: any[]; // Puedes tiparlo mejor si sabes la estructura
}
export interface CitaEnCurso {
  name: string; // AG-...
  estcit_color: string;
  estcit_descripcion: string;
  age_fechacita: string;
  age_hinicio: string;
  age_hfin: string;
  age_duracion: number;
  mod_descripcion: string;
  prosal_nombrecompleto: string;
  pac_nombrecompleto: string;
  psxum_codigo: string;
  pac_fotoini: string | null;
  paciente_name: string;
  pac_email: string;
  pac_telefono: string | null;
  pac_celular: string;
  atencion_name: string; // ATE-...
  signosvitales_name: string | null; // SV-... o null
}