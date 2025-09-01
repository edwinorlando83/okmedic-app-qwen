// src/app/interfaces/okm-informeexaodon.interface.ts
export interface OKM_InformeExaOdon {
  name?: string;
  parent?: string;
  parentfield?: string;
  parenttype?: string;
  exaodo_codigo?: string; // Link a OKM_EXAMENODONTO
  infexaodo_realizado?: string; // "SI" o "NO"
  infexaodo_desc?: string;
}