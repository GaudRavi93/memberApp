import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [TaskCardComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [TaskCardComponent]
})
export class TaskCardModule { }
