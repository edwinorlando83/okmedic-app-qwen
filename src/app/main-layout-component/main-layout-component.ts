// src/app/layouts/main-layout/main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
 
import { NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
imports: [
    RouterOutlet, 
    RouterLink,       // ✅ Añade RouterLink aquí
    RouterLinkActive, // ✅ Añade RouterLinkActive aquí
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

  menuItems = [
    { name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
    { name: 'Agenda', icon: 'fas fa-calendar-alt', route: '/agenda' },
    { name: 'Pacientes', icon: 'fas fa-users', route: '/pacientes' },
    { name: 'Consultas', icon: 'fas fa-stethoscope', route: '/consultas' },
    { name: 'Configuración', icon: 'fas fa-cog', route: '/configuracion' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar preferencia de tema del localStorage
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();
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
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUser(): string {
    return localStorage.getItem('user') || 'Dr.';
  }
}