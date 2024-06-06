import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { TaskCardModule } from 'src/app/components/task-card/task-card.module';
import { FeedbackCardModule } from 'src/app/components/feedback-card/feedback-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TaskCardModule,
    FeedbackCardModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
