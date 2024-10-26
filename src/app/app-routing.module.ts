import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then(m => m.RecuperarPageModule)
  },
  
  {
    path: 'detalle-viajes/:id',
    loadChildren: () => import('./pages/detalle-viaje/detalle-viaje.module').then(m => m.DetalleViajePageModule)
  },
  {
    path: 'registrar-viaje',
    loadChildren: () => import('./pages/registrar-viaje/registrar-viaje.module').then(m => m.RegistrarViajePageModule)
  },
  {
    path: 'viaje',
    loadChildren: () => import('./pages/viaje/viaje.module').then(m => m.ViajePageModule)
  },
  {
    path: 'mis-viajes',
    loadChildren: () => import('./pages/mis-viajes/mis-viajes.module').then(m => m.MisViajesPageModule)
  },
  {
    path: 'contacto',
    loadChildren: () => import('./pages/contacto/contacto.module').then(m => m.ContactoPageModule)
  },
  {
    path: 'ayuda',
    loadChildren: () => import('./pages/ayuda/ayuda.module').then(m => m.AyudaPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


