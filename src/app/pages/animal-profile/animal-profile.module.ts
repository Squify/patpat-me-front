import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalProfilePageRoutingModule } from './animal-profile-routing.module';

import { AnimalProfilePage } from './animal-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimalProfilePageRoutingModule
  ],
  declarations: [AnimalProfilePage]
})
export class AnimalProfilePageModule {}
