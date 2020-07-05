import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalsPageRoutingModule } from './legals-routing.module';

import { LegalsPage } from './legals.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LegalsPageRoutingModule,
        TranslateModule
    ],
  declarations: [LegalsPage]
})
export class LegalsPageModule {}
