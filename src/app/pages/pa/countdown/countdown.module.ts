import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountdownPageRoutingModule } from './countdown-routing.module';

import { CountdownPage } from './countdown.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountdownPageRoutingModule
  ],
  declarations: [CountdownPage]
})
export class CountdownPageModule {}
