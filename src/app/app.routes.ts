// src/app/app.routes.ts
import { Routes } from '@angular/router';
 
import { inject } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login';
import { DashboardComponent } from './dashboard/dashboard/dashboard';
import { AgendaComponent } from './medico/agenda/agenda';
import { MainLayoutComponent } from './main-layout-component/main-layout-component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [() => inject(AuthGuard).canActivate()],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'agenda', component: AgendaComponent },
      // Aquí puedes añadir más rutas protegidas
    ]
  },
  { path: '**', redirectTo: '/login' }
];