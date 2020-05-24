import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimalEditPage } from './animal-edit.page';

describe('UpdateAnimalPage', () => {
  let component: AnimalEditPage;
  let fixture: ComponentFixture<AnimalEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
