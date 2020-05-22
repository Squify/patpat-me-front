import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventEditPageRoutingModule } from './event-edit-routing.module';

import { EventEditPage } from './event-edit.page';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EventEditPageRoutingModule,
        TranslateModule,
        ReactiveFormsModule
    ],
  declarations: [EventEditPage]
})
export class EventEditPageModule {}
