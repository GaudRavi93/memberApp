import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaPage } from './pa.page';

const routes: Routes = [
  {
    path: '',
    component: PaPage,
  },
      {
        path: 'countdown',
        loadChildren: () => import('../pa/countdown/countdown.module').then( m => m.CountdownPageModule)
      },
      {
        path: 'exercise/',
        loadChildren: () => import('../pa/exercise/exercise.module').then( m => m.ExercisePageModule)
      },
      {
        path: 'rest/:restId',
        loadChildren: () => import('../pa/rest/rest.module').then( m => m.RestPageModule)
      },
      {
        path: 'feedback',
        loadChildren: () => import('../pa/feedback/feedback.module').then( m => m.FeedbackPageModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('../pa/stats/stats.module').then( m => m.StatsPageModule)
      },
      {
        path: 'taste',
        loadChildren: () => import('../pa/taste/taste.module').then( m => m.TastePageModule)
      },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaPageRoutingModule {}
