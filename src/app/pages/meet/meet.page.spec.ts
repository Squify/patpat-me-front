import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetPage } from './meet.page';

describe('MeetPage', () => {
  let component: MeetPage;
  let fixture: ComponentFixture<MeetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
