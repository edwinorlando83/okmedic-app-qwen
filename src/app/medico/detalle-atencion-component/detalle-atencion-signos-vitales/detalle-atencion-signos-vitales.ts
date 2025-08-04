import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-signos-vitales',
  imports: [],
  templateUrl: './detalle-atencion-signos-vitales.html',
  styleUrl: './detalle-atencion-signos-vitales.css'
})
export class DetalleAtencionSignosVitales {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
