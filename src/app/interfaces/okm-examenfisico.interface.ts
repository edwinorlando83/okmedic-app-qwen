export interface OKM_ExamenFisico {
  name?: string;
  parent?: string;
  parentfield?: string;
  parenttype?: string;
  ate_id?: string;
  pac_historiaclinica?: string;
  exafis_fecha?: string;
  exafis_hora?: string;
  exafis_desc?: string;
  exafis_detalle?: OKM_DetExamenFisico[];
  exafis_codigo?: string;
}

export interface OKM_DetExamenFisico {
  name?: string;
  parent?: string;
  parentfield?: string;
  parenttype?: string;
  orgreg_codigo?: string;
  detexaf_evidencia?: string;
  okm_region?: string;
  detalle?: string;
}