import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TastePageRoutingModule } from './taste-routing.module';

import { TastePage } from './taste.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TastePageRoutingModule
  ],
  declarations: [TastePage]
})
export class TastePageModule {}
