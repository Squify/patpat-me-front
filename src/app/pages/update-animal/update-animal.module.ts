import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateAnimalPageRoutingModule } from './update-animal-routing.module';

import { UpdateAnimalPage } from './update-animal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateAnimalPageRoutingModule
  ],
  declarations: [UpdateAnimalPage]
})
export class UpdateAnimalPageModule {}
