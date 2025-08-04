import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-antecedentes',
  imports: [],
  templateUrl: './detalle-atencion-antecedentes.html',
  styleUrl: './detalle-atencion-antecedentes.css'
})
export class DetalleAtencionAntecedentes {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
