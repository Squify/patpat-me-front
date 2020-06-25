import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetPageRoutingModule } from './meet-routing.module';

import { MeetPage } from './meet.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MeetPageRoutingModule,
        TranslateModule
    ],
  declarations: [MeetPage]
})
export class MeetPageModule {}
