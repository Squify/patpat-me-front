import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LegalsPage } from './legals.page';

describe('LegalsPage', () => {
  let component: LegalsPage;
  let fixture: ComponentFixture<LegalsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LegalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
