// src/app/app.routes.ts
import { Routes } from '@angular/router';
 
import { inject } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login';
import { MainLayoutComponent } from './main-layout-component/main-layout-component';
import { DashboardComponent } from './dashboard/dashboard/dashboard';
import { AgendaComponent } from './medico/agenda/agenda';
import { AtencionMedicaComponent } from './medico/atencion-medica-component/atencion-medica-component';
import { SignosVitalesComponent } from './enfermera/signos-vitales-component/signos-vitales-component';
import { AdmisionComponent } from './enfermera/admision-component/admision-component';
import { PacientesComponent } from './enfermera/pacientes-component/pacientes-component';
import { ConfiguracionComponent } from './configuracion-component/configuracion-component';

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
      { path: 'atencion-medica', component: AtencionMedicaComponent }, 
      { path: 'signos-vitales', component: SignosVitalesComponent },   
      { path: 'admision', component: AdmisionComponent },             
      { path: 'pacientes', component: PacientesComponent },           
      { path: 'configuracion', component: ConfiguracionComponent },    
    ]
  },
  { path: '**', redirectTo: '/login' }
];