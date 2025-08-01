// src/app/layouts/main-layout/main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
 
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService, ProfesionalSalud } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink,
    RouterLinkActive,
    NgClass, 
    NgFor, 
    NgIf
  ],
  templateUrl: './main-layout-component.html',
  styleUrls: ['./main-layout-component.css']
})
export class MainLayoutComponent implements OnInit {
  isSidebarOpen = true;
  isDarkMode = false;
  profesional: ProfesionalSalud | null = null;
  menuItems: any[] = []; // ✅ Menú dinámico

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();
    this.profesional = this.authService.getProfesionalSalud();
    this.initializeMenu(); // ✅ Inicializamos el menú según el rol
  }

  // ✅ Método para inicializar el menú según el rol
  private initializeMenu(): void {
    if (this.profesional) {
      const rol = this.profesional.rol?.toUpperCase();
      
      switch (rol) {
        case 'DOCTOR':
          this.menuItems = [
            { name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
            { name: 'Agenda', icon: 'fas fa-calendar-alt', route: '/agenda' },
            { name: 'Atención Médica', icon: 'fas fa-stethoscope', route: '/atencion-medica' },
            { name: 'Pacientes', icon: 'fas fa-users', route: '/pacientes' },
            { name: 'Configuración', icon: 'fas fa-cog', route: '/configuracion' }
          ];
          break;
          
        case 'ENFERMERA':
          this.menuItems = [
            { name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
            { name: 'Agenda', icon: 'fas fa-calendar-alt', route: '/agenda' },
            { name: 'Signos Vitales', icon: 'fas fa-heartbeat', route: '/signos-vitales' },
            { name: 'Admisión', icon: 'fas fa-user-plus', route: '/admision' },
            { name: 'Pacientes', icon: 'fas fa-users', route: '/pacientes' },
            { name: 'Configuración', icon: 'fas fa-cog', route: '/configuracion' }
          ];
          break;
          
        default:
          // Menú por defecto si no se reconoce el rol
          this.menuItems = [
            { name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
            { name: 'Agenda', icon: 'fas fa-calendar-alt', route: '/agenda' },
            { name: 'Configuración', icon: 'fas fa-cog', route: '/configuracion' }
          ];
      }
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUser(): string {
    if (this.profesional && this.profesional.nombre) {
      return this.profesional.nombre.split(' ')[0] || 'Profesional';
    }
    return localStorage.getItem('user') || 'Profesional';
  }

  getFotoProfesional(): string {
    return this.profesional?.foto || 'https://tudoctor.okmedic.online/files/tudoctorok.jpeg';
  }

  // ✅ Método para obtener el rol
  getRol(): string {
    return this.profesional?.rol || 'N/A';
  }
}