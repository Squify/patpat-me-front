import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateAnimalPage } from './create-animal.page';

describe('CreateAnimalPage', () => {
  let component: CreateAnimalPage;
  let fixture: ComponentFixture<CreateAnimalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAnimalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
