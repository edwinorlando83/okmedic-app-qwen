import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-atencion-historial.html',
  styleUrl: './detalle-atencion-historial.css'
})
export class DetalleAtencionHistorial {
  @Input() ate_id: string = '';

   ngOnInit(): void {
    // Aquí puedes usar this.ate_id
    console.log('Historial recibió ate_id:', this.ate_id);
  }

}
