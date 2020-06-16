import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalPageRoutingModule } from './animal-routing.module';

import { AnimalPage } from './animal.page';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AnimalPageRoutingModule,
        TranslateModule
    ],
  declarations: [AnimalPage]
})
export class AnimalPageModule {}
