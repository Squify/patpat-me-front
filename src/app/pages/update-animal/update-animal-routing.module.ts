import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateAnimalPage } from './update-animal.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateAnimalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateAnimalPageRoutingModule {}
