import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-consentimiento',
  imports: [],
  templateUrl: './detalle-atencion-consentimiento.html',
  styleUrl: './detalle-atencion-consentimiento.css'
})
export class DetalleAtencionConsentimiento {
 @Input() ate_id: string = '';
  ngOnInit(): void {
  
  }
}
