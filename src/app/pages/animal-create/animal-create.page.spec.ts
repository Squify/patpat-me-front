import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimalCreatePage } from './animal-create.page';

describe('CreateAnimalPage', () => {
  let component: AnimalCreatePage;
  let fixture: ComponentFixture<AnimalCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
