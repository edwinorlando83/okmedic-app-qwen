import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-lugar-atencion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-atencion-lugar-atencion.html',
  styleUrl: './detalle-atencion-lugar-atencion.css'
})
export class DetalleAtencionLugarAtencion {
  @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
