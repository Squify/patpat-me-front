import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimalPage } from './animal.page';

const routes: Routes = [
  {
    path: '',
    component: AnimalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimalPageRoutingModule {}
