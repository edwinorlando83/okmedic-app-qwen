import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-certificado',
  imports: [],
  templateUrl: './detalle-atencion-certificado.html',
  styleUrl: './detalle-atencion-certificado.css'
})
export class DetalleAtencionCertificado {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
