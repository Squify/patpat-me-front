import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventEditPage } from './event-edit.page';

describe('EventEditPage', () => {
  let component: EventEditPage;
  let fixture: ComponentFixture<EventEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
