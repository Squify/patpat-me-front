import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnimalEditPage } from './animal-edit.page';

const routes: Routes = [
  {
    path: '',
    component: AnimalEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimalEditPageRoutingModule {}
