import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-examen-fisco',
  imports: [],
  templateUrl: './detalle-atencion-examen-fisco.html',
  styleUrl: './detalle-atencion-examen-fisco.css'
})
export class DetalleAtencionExamenFisco {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  } 
}
