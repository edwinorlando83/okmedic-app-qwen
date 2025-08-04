import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-motivo-consulta',
  imports: [],
  templateUrl: './detalle-atencion-motivo-consulta.html',
  styleUrl: './detalle-atencion-motivo-consulta.css'
})
export class DetalleAtencionMotivoConsulta {
  @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
