import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestsNotFoundPageRoutingModule } from './tests-not-found-routing.module';

import { TestsNotFoundPage } from './tests-not-found.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestsNotFoundPageRoutingModule
  ],
  declarations: [TestsNotFoundPage]
})
export class TestsNotFoundPageModule {}
