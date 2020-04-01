import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccountCreatePage } from './account-create.page';

describe('AccountCreatePage', () => {
  let component: AccountCreatePage;
  let fixture: ComponentFixture<AccountCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
