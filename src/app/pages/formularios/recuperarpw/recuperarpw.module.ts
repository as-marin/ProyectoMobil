import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarpwPageRoutingModule } from './recuperarpw-routing.module';

import { RecuperarpwPage } from './recuperarpw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarpwPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RecuperarpwPage]
})
export class RecuperarpwPageModule {}
