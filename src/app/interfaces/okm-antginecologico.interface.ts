export interface OKM_AntGinecologico {
  name: string;
  parent?: string;
  parentfield?: string;
  parenttype?: string;
  antgin_menarquia?: string; // "SI" o "NO"
  antgin_edadmenarquia?: number;
  antgin_fecultmens?: string; // Fecha
  antgin_usamanticonceptivo?: string; // "SI" o "NO"
  metant_codigo?: string; // Link a OKM_METODOANTICONCEPTIVO
  antgin_madrelactancia?: string; // "SI" o "NO"
  antgin_fechapartolac?: string; // Fecha
  antgin_alerta?: string;
  antgin_observacion?: string;
}