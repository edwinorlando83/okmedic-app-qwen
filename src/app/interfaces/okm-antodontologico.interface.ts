// src/app/interfaces/okm-antodontologico.interface.ts
export interface OKM_AntOdontologico {
  name: string; // ID del registro hijo
  dantodo_codigo?: string; // Link a OKM_TIPOAODON
  antodo_valor?: 'SI' | 'NO' | 'SIN INFORMACION'; // Select
  antodo_desc?: string; // Data
  parent?: string; // Referencia al padre (OKM_ATENCION)
  parentfield?: string; // 'ate_aodontologicos'
  parenttype?: string; // 'OKM_ATENCION'
}