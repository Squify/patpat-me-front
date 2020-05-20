import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalCreatePageRoutingModule } from './animal-create-routing.module';

import { AnimalCreatePage } from './animal-create.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AnimalCreatePageRoutingModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
  declarations: [AnimalCreatePage]
})
export class AnimalCreateModule {}
