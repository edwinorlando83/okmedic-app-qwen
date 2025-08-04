import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-evolucion',
  imports: [],
  templateUrl: './detalle-atencion-evolucion.html',
  styleUrl: './detalle-atencion-evolucion.css'
})
export class DetalleAtencionEvolucion {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
