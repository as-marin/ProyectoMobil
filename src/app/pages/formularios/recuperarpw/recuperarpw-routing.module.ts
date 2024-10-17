import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarpwPage } from './recuperarpw.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarpwPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarpwPageRoutingModule {}
