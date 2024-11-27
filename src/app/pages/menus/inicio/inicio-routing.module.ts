import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage
  },
  {
    
      path: 'user',
      loadChildren: () => import('../../perfiles/user/user.module').then( m => m.UserPageModule)
    
  },
  {
     
    path: 'scan',
    loadChildren: () => import('../scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'inscripcion',
    loadChildren: () => import('../inscripcion/inscripcion.module').then( m => m.InscripcionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
