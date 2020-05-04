import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateAnimalPage } from './update-animal.page';

describe('UpdateAnimalPage', () => {
  let component: UpdateAnimalPage;
  let fixture: ComponentFixture<UpdateAnimalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAnimalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateAnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
