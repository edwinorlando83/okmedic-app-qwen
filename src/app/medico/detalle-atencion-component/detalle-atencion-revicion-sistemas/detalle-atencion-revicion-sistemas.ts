import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalle-atencion-revicion-sistemas',
  imports: [],
  templateUrl: './detalle-atencion-revicion-sistemas.html',
  styleUrl: './detalle-atencion-revicion-sistemas.css'
})
export class DetalleAtencionRevicionSistemas {

 @Input() ate_id: string = '';
 
  ngOnInit(): void {
  
  }
}
