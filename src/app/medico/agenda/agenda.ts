// src/app/agenda/agenda.component.ts
import { Component } from '@angular/core';
import { NgClass } from '@angular/common'; // Para [ngClass]

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [NgClass],
  templateUrl: './agenda.html',
  styleUrls: ['./agenda.css']
})
export class AgendaComponent {
  activeTab = 'disponibles'; // Pestaña activa por defecto
  selectedDate = new Date().toISOString().split('T')[0]; // Fecha de hoy

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    console.log('Fecha seleccionada:', this.selectedDate);
  }

 

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}