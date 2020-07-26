import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CguPage } from './cgu.page';

describe('CguPage', () => {
  let component: CguPage;
  let fixture: ComponentFixture<CguPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CguPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CguPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
