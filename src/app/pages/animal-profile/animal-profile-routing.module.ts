import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimalProfilePage } from './animal-profile.page';

const routes: Routes = [
  {
    path: '',
    component: AnimalProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimalProfilePageRoutingModule {}
