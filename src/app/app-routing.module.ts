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
    path: 'elegir',
    loadChildren: () => import('./pages/formularios/elegir/elegir.module').then( m => m.ElegirPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/perfiles/user/user.module').then( m => m.UserPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/perfiles/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/menus/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./pages/menus/config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: 'tests-not-found',
    loadChildren: () => import('./pages/tests-not-found/tests-not-found.module').then( m => m.TestsNotFoundPageModule)
  },  {
    path: 'recuperarpw',
    loadChildren: () => import('./pages/formularios/recuperarpw/recuperarpw.module').then( m => m.RecuperarpwPageModule)
  },









];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
