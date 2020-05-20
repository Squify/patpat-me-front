import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimalProfilePage } from './animal-profile.page';

describe('AnimalProfilePage', () => {
  let component: AnimalProfilePage;
  let fixture: ComponentFixture<AnimalProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
