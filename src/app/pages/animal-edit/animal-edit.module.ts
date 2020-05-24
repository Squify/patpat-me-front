import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalEditPageRoutingModule } from './animal-edit-routing.module';

import { AnimalEditPage } from './animal-edit.page';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AnimalEditPageRoutingModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
  declarations: [AnimalEditPage]
})
export class AnimalEditModule {}
