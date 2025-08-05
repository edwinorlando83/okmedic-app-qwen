// src/app/interfaces/okm-atencion.interface.ts

// --- Interfaces para campos Link (referencias a otros Doctypes) ---

// OKM_LUGARATENCION
export interface LugarAtencion {
  lugate_codigo: string; // Data (Unique)
  lugate_desc: string;   // Data
}

// OKM_CRONOLOGIA
export interface Cronologia {
  cro_codigo: string; // Data (Unique)
  cro_desc: string;   // Data
}

// OKM_ESPECIALIDAD
export interface Especialidad {
  esp_codigo: string; // Data (Unique)
  esp_desc: string;    // Data
}

// OKM_PACIENTE
export interface Paciente {
  pac_historiaclinica: string; // Data (Unique)
  // ... (otros campos del paciente que puedan ser relevantes)
  // Basado en el archivo, hay muchos más campos en OKM_PACIENTE
}

// OKM_PROFSALUD
export interface ProfesionalSalud {
  prosal_cedopasaporte: string; // Data (Unique)
  // ... (otros campos del profesional)
}

// OKM_TIPOCITA
export interface TipoCita {
  tipcit_codigo: string; // Data (Unique)
  // ... (otros campos)
}

// OKM_UNIDADMEDICA
export interface UnidadMedica {
  unimed_codigo: string; // Asumiendo este es el campo código
  // ... (otros campos)
}

// OKM_MODALIDAD (basado en la definición parcial)
export interface Modalidad {
  mod_codigo: string; // Data (Unique)
  mod_descripcion: string; // Data
}

// --- Interfaces para campos Table (Doctypes hijos como tabla) ---

// Ejemplo: OKM_ENFXATENCION (tabla hija)
// Nota: La definición completa no está, pero se infiere que tiene campos específicos
export interface EnfermedadXFAtencion {
  // cro_codigo: string; // Link a OKM_CRONOLOGIA (ejemplo de campo que podría existir)
  // ... (otros campos de la tabla)
  [key: string]: any; // Placeholder genérico
}

// Ejemplo: OKM_AISLAMIENTO (tabla hija, istable: 0 indica que podría ser un link?)
// Revisando mejor, parece ser istable: 0, por lo que es otro Doctype, no una tabla hija.
// Por lo tanto, un campo ais_codigo en OKM_ATENCION sería un Link a OKM_AISLAMIENTO
export interface Aislamiento {
  ais_codigo: string; // Data (Unique)
  ais_desc: string;   // Data
}

// ... (Se podrían definir interfaces para OKM_ATECERTIFICADO, OKM_TRATCOVID, etc., si fueran tablas hijas)


// --- Interfaz Principal: OKM_ATENCION ---
// Basada en la definición parcial y suponiendo nombres de campos comunes

export interface OKM_Atencion {
  // --- Campos principales del Doctype ---
  name: string; // El ID del documento en Frappe
  owner: string;
  creation: string; // Fecha de creación (ISO string)
  modified: string; // Fecha de modificación (ISO string)
  modified_by: string;
  docstatus: number; // 0=Borrador, 1=Presentado, 2=Cancelado
  
  // --- Campos específicos de OKM_ATENCION ---
  // Links a otros Doctypes
  lugate_codigo: LugarAtencion; // Link a OKM_LUGARATENCION
  cro_codigo: Cronologia;       // Link a OKM_CRONOLOGIA
  esp_codigo?: Especialidad;      // Link a OKM_ESPECIALIDAD (opcional según reqd: 0)
  pac_historiaclinica: Paciente; // Link a OKM_PACIENTE
  prosal_cedopasaporte: ProfesionalSalud; // Link a OKM_PROFSALUD
  tipcit_codigo?: TipoCita;       // Link a OKM_TIPOCITA (aunque en la definición dice reqd: 0 para tipcit_codigo en OKM_PROFSALUD, aquí es reqd: 0)
  unimed_codigo: UnidadMedica;  // Link a OKM_UNIDADMEDICA
  mod_codigo: Modalidad;        // Link a OKM_MODALIDAD
  
  // Datos simples
  ate_id?: string;              // Data (Unique, pero reqd: 0) - ID de la Atencion
  ate_fechaini: string;         // Date (reqd: 1)
  ate_horaini: string;          // Time (reqd: 1)
  ate_fechafin?: string;        // Date (reqd: 0)
  ate_horafin?: string;         // Time (reqd: 0)
  ate_edadfecha?: number;       // Int (reqd: 0) - Edad del paciente en la consulta
  
  // Campos Table (tablas hijas)
  // Nota: Estos son arrays de objetos hijos. La definición completa de los hijos
  // no está disponible, por lo que se usa un tipo genérico o any[] por ahora.
  // Se pueden refinar más cuando sepamos la estructura de las tablas hijas.
  ate_enfxatencion?: EnfermedadXFAtencion[]; // Table (options: OKM_ENFXATENCION)
  // ate_aislamiento?: Aislamiento; // Si ais_codigo es un Link, no una Table
  // ... (otros campos Table como ate_certificados, ate_tratamientos_covid, etc.)
  
  // --- Campos adicionales que podrían existir basados en la definición ---
  // (Muchos otros campos posibles según el txt, pero no todos están definidos claramente)
  // Se pueden añadir conforme se necesiten o se tenga más información.
  
  // Placeholder para campos no definidos explícitamente aquí
  [key: string]: any;
}

// --- Interfaces auxiliares para datos procesados en la UI (opcional) ---

// Esta interfaz puede ser útil para pasar datos específicos a los componentes hijos
// en lugar de pasar todo el objeto OKM_Atencion
export interface DatosAtencionResumen {
  id: string;
  pacienteNombre: string;
  pacienteIdentificacion: string;
  fechaInicio: string; // ISO string
  horaInicio: string;
  lugarAtencion: string;
  profesionalNombre: string;
  especialidad?: string;
  // ... otros campos resumidos relevantes
}
