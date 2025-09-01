export interface OKM_RevisionOrgsis {
  name?: string;
  parent?: string;
  parentfield?: string;
  parenttype?: string;
  ate_id?: string;
  pac_historiaclinica?: string;
  revorgsis_fecha?: string;
  revorgsis_desc?: string;
  revorgsis_detalle?: OKM_DetRevision[];
  revorgsis_codigo?: string;
}

export interface OKM_DetRevision {
  name?: string;
  parent?: string;
  parentfield?: string;
  parenttype?: string;
  orgsis_codigo?: string;
  detrev_evidencia?: string;
}