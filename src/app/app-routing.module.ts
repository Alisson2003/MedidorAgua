import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'lectura',
    loadChildren: () => import('./pages/lectura/lectura.module').then( m => m.LecturaPageModule)
  },
  {
    path: 'lista-lecturas',
    loadChildren: () => import('./pages/lista-lecturas/lista-lecturas.module').then( m => m.ListaLecturasPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
