import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElegirPageRoutingModule } from './elegir-routing.module';

import { ElegirPage } from './elegir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElegirPageRoutingModule
  ],
  declarations: [ElegirPage]
})
export class ElegirPageModule {}
