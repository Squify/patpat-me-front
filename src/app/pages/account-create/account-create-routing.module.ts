import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountCreatePage } from './account-create.page';

const routes: Routes = [
  {
    path: '',
    component: AccountCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountCreatePageRoutingModule {}
