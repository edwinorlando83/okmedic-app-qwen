import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-tratamiento',
  imports: [],
  templateUrl: './detalle-atencion-tratamiento.html',
  styleUrl: './detalle-atencion-tratamiento.css'
})
export class DetalleAtencionTratamiento {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
