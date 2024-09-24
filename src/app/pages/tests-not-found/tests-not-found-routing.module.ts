import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestsNotFoundPage } from './tests-not-found.page';

const routes: Routes = [
  {
    path: '',
    component: TestsNotFoundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestsNotFoundPageRoutingModule {}
