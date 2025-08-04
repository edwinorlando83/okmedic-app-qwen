import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-diagnostico',
  imports: [],
  templateUrl: './detalle-atencion-diagnostico.html',
  styleUrl: './detalle-atencion-diagnostico.css'
})
export class DetalleAtencionDiagnostico {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
