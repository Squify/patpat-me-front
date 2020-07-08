import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalsPage } from './legals.page';

const routes: Routes = [
  {
    path: '',
    component: LegalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalsPageRoutingModule {}
