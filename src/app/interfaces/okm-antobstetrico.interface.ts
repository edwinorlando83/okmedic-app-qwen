// src/app/interfaces/okm-antobstetrico.interface.ts
export interface OKM_AntObstetrico {
  name: string; // ID del registro hijo
  antobs_peso?: number; // Int
  antobs_talla?: number; // Int
  antobs_imc?: number; // Float
  antobs_presionarterial?: string; // Data
  antobs_fur?: string; // Date
  antobs_fpp?: string; // Date
  antobs_ecografia?: string; // Data
  antobs_numeroembarazos?: number; // Int
  antobs_numeropartos?: number; // Int
  antobs_numerohijosvivos?: number; // Int
  antobs_numerohijosmuertos?: number; // Int
  antobs_abortos?: number; // Int
  antobs_hijossanos?: number; // Int
  antobs_hijosconproblemas?: number; // Int
  antobs_complicaciones?: string; // Small Text
  antobs_observacion?: string; // Small Text
  antobs_alerta?: string; // Data
  parent?: string; // Referencia al padre (OKM_ATENCION)
  parentfield?: string; // 'ate_antobstetricos'
  parenttype?: string; // 'OKM_ATENCION'
}