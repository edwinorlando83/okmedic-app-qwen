// Interfaces para DocTypes relacionados (basadas en la información proporcionada)
// Puedes ampliar estas interfaces según las definiciones completas de cada DocType

export interface OKM_TipoIdentificacion {
  name: string; // tipide_codigo
  tipide_desc: string;
}

export interface OKM_Sexo {
  name: string; // sex_codigo
  sex_desc: string;
}

export interface OKM_EstadoCivil {
  name: string; // estciv_codigo
  estciv_desc: string;
}

export interface OKM_Pais {
  name: string; // pai_codigo
  pai_desc: string;
}

export interface OKM_Provincia {
  name: string; // Código de provincia
  // ... otros campos si existen
}

export interface OKM_Canton {
  name: string; // Código de cantón
  // ... otros campos si existen
}

export interface OKM_Parroquia {
  name: string; // Código de parroquia
  // ... otros campos si existen
}

export interface OKM_DPA {
  dpa_codigo: string;
  dpa_provincia: string;
  dpa_canton: string;
  dpa_parroquia: string;
  // ... otros campos
}

export interface OKM_AlertaPaciente {
  name: string;
  alepac_desc: string;
  alepac_estado: 'ACTIVA' | 'INACTIVA';
}

export interface OKM_AdjuntoPaciente {
  name: string;
  tipadj_codigo: string; // Link a OKM_TIPOADJUNTO
  adjpac_desc: string;
  adjpac_fecharea: string; // Date
  adjpac_vigente: 'SI' | 'NO';
  adjpac_adjunto: string; // Attach
}

export interface OKM_ParientePaciente {
  name: string;
  okm_pac_historiaclinica: string; // Link a OKM_PACIENTE
  par_codigo: string; // Link a OKM_PARENTESCO
  pacpar_nota: string; // Small Text
}

// Interfaz principal para OKM_PACIENTE
export interface OKM_Paciente {
  // Campos estándar de Frappe
  name: string; // Este será pac_historiaclinica
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number; // 0=Borrador, 1=Presentado, 2=Cancelado

  // Campos específicos de OKM_PACIENTE
  pac_historiaclinica: string; // Data (Unique)
  tipide_codigo: string; // Link a OKM_TIPOIDENTIFICACION
  pac_identificacion: string; // Data (Unique)
  pac_pnombre: string; // Data
  pac_snombre: string; // Data
  pac_papellido: string; // Data
  pac_sapellido: string; // Data
  pac_nombrecompleto: string; // Data (Read Only)
  sex_codigo: string; // Link a OKM_SEXO (Reqd: 1)
  lat_codigo: string; // Link a OKM_LATERALIDAD (Reqd: 1)
  estciv_codigo: string; // Link a OKM_ESTADOCIVIL
  pac_fechanac: string; // Date (Reqd: 1)
  pac_nacionalidad: string; // Data
  pai_codigo: string; // Link a OKM_PAIS
  // ... (otros campos según la definición)
    pac_email: string;
    pac_telefono: string;
    pac_celular: string; 
  // Campos para tablas hijas
  pac_alertas?: OKM_AlertaPaciente[]; // Table (options: OKM_ALERTAPACIENTE)
  pac_infoadicional?: OKM_AdjuntoPaciente[]; // Table (options: OKM_ADJUNTOPACIENTE)
  pac_parientes?: OKM_ParientePaciente[]; // Table (options: OKM_PACPARIENTES)
  
  // Campos calculados o virtuales (no vienen directamente de Frappe)
  edad?: number; // Calculada a partir de pac_fechanac
  // ... otros campos virtuales
  provincia?: string; // Calculada a partir de pai_codigo
  canton?: string; // Calculada a partir de dpa_canton
  parroquia?: string; // Calculada a partir de dpa_parroquia    

  pac_edadfecha ?: number;
  pac_fotoini ?: string;

    pac_alertafija?: string; // Agregar esta línea
  // ... (otros campos existentes) ...
 pac_lladireccion?: string;

}