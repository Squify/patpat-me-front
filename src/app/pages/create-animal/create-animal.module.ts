import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAnimalPageRoutingModule } from './create-animal-routing.module';

import { CreateAnimalPage } from './create-animal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateAnimalPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateAnimalPage]
})
export class CreateAnimalPageModule {}
