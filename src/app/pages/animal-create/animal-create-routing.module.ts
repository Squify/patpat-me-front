import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimalCreatePage } from './animal-create.page';

const routes: Routes = [
  {
    path: '',
    component: AnimalCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimalCreatePageRoutingModule {}
