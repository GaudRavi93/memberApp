import { TabsPage } from './tabs.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'care',
        loadChildren: () => import('../care/care.module').then( m => m.CarePageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then( m => m.ChatPageModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('../calendar/calendar.module').then( m => m.CalendarPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'giveaway',
        loadChildren: () => import('../giveaway/giveaway.module').then( m => m.GiveawayPageModule)
      },
      {
        path: 'health',
        loadChildren: () => import('../health/health.module').then( m => m.HealthPageModule)
      },
      {
        path: 'pa/:workoutId',
        loadChildren: () => import('../pa/pa.module').then( m => m.PaPageModule)
      },
      {
        path: 'medication',
        loadChildren: () => import('../medication/medication.module').then( m => m.MedicationPageModule)
      },
      {
        path: 'habit/:habitId',
        loadChildren: () => import('../habit/habit.module').then( m => m.HabitsPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
