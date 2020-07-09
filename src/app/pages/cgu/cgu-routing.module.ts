import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CguPage } from './cgu.page';

const routes: Routes = [
  {
    path: '',
    component: CguPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CguPageRoutingModule {}
