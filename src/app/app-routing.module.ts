import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'lectura',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/lectura/lectura.module').then(m => m.LecturaPageModule),
  },
  {
    path: 'lista-lectura',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/lista-lecturas/lista-lecturas.module').then(m => m.ListaLecturasPageModule),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/administrador/administrador.module').then(m => m.AdministradorPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'nueva-lectura',
    loadChildren: () => import('./pages/nueva-lectura/nueva-lectura.module').then( m => m.NuevaLecturaPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
