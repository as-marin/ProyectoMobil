import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
<<<<<<< HEAD

  {
    path: 'login',
    loadChildren: () => import('./pages/formularios/login/login.module').then( m => m.LoginPageModule)
=======
  {
    path: 'registro',
    loadChildren: () => import('./pages/formularios/registro/registro.module').then(m => m.RegistroPageModule)
>>>>>>> 21a3cc61febc3c0bbf73ee98aa737d2185d40868
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
