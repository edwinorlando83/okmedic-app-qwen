// src/app/pipes/hora-formato.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaFormato',
  standalone: true // Para Angular 15+
})
export class HoraFormatoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // Asumimos que el valor viene en formato HH:mm o HH:mm:ss
    const partes = value.split(':');
    if (partes.length < 2) return value;

    const horas = parseInt(partes[0], 10);
    const minutos = partes[1];

    if (isNaN(horas)) return value;

    const sufijo = horas >= 12 ? 'PM' : 'AM';
    const horas12 = horas % 12 || 12; // 0 se convierte en 12

    return `${horas12}:${minutos} ${sufijo}`;
  }
}