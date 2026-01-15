import { Routes } from '@angular/router';
import {AuthGuard} from './services/auth.guard'

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ClientDetailComponent } from './pages/client-detail/client-detail.component';
import { ClientFormComponent } from './pages/client-form/client-form.component';

export const routes: Routes = [
  // Routes publiques
  {
    path: 'login',
    component: LoginComponent
  },
  
  // Routes protégées
  { 
    path: 'clients/new', 
    component: ClientFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    component: ClientsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/:id',
    component: ClientDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/:id/edit', 
    component: ClientFormComponent,
    canActivate: [AuthGuard]
  },
  
  // Redirections
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
