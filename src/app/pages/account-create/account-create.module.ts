import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountCreatePageRoutingModule } from './account-create-routing.module';

import { AccountCreatePage } from './account-create.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AccountCreatePageRoutingModule,
        ReactiveFormsModule,
        TranslateModule
    ],
  declarations: [AccountCreatePage]
})
export class AccountCreatePageModule {}
