// src/app/pipes/fecha-completa.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaCompleta',
  standalone: true // Para Angular 15+
})
export class FechaCompletaPipe implements PipeTransform {

  private readonly meses: string[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  private readonly diasSemana: string[] = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  transform(value: string | Date): string {
    if (!value) return '';

    const fecha = new Date(value);
    if (isNaN(fecha.getTime())) return value.toString(); // Si no es una fecha válida, retornar el valor original

    const diaSemana = this.diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = this.meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    return `${diaSemana}, ${dia} de ${mes} de ${anio}`;
  }
}