import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FeedbackCardComponent } from './feedback-card.component';



@NgModule({
  declarations: [FeedbackCardComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FeedbackCardComponent]
})
export class FeedbackCardModule { }
