import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './profile-edit-routing.module';

import { ProfileEditPage } from './profile-edit.page';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditProfilePageRoutingModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [ProfileEditPage]
})
export class EditProfilePageModule {
}
