import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TastePage } from './taste.page';

const routes: Routes = [
  {
    path: '',
    component: TastePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TastePageRoutingModule {}
