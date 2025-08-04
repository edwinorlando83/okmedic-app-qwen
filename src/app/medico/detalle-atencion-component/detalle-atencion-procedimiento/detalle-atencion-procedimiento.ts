import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-procedimiento',
  imports: [],
  templateUrl: './detalle-atencion-procedimiento.html',
  styleUrl: './detalle-atencion-procedimiento.css'
})
export class DetalleAtencionProcedimiento {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
