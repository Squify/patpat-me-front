import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateAnimalPage } from './create-animal.page';

const routes: Routes = [
  {
    path: '',
    component: CreateAnimalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateAnimalPageRoutingModule {}
