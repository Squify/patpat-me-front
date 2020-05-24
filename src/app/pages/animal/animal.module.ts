import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalPageRoutingModule } from './animal-routing.module';

import { AnimalPage } from './animal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimalPageRoutingModule
  ],
  declarations: [AnimalPage]
})
export class AnimalPageModule {}
