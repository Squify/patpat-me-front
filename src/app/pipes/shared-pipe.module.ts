import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFilterPipe } from './event/event-filter.pipe';

@NgModule({
  declarations: [EventFilterPipe],
  imports: [
    CommonModule
  ],
  exports: [
    EventFilterPipe
  ]
})
export class SharedPipeModule { }
