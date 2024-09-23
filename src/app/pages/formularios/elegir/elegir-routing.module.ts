import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElegirPage } from './elegir.page';

const routes: Routes = [
  {
    path: '',
    component: ElegirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElegirPageRoutingModule {}
