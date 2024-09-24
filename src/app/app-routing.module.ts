import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'bienvenida',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/formularios/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/formularios/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'bienvenida',
    loadChildren: () => import('./pages/welcomes/bienvenida/bienvenida.module').then( m => m.BienvenidaPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/inicio/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'elegir',
    loadChildren: () => import('./pages/formularios/elegir/elegir.module').then( m => m.ElegirPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/inicio/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'scanner',
    loadChildren: () => import('./pages/inicio/scanner/scanner.module').then( m => m.ScannerPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
