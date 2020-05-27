import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnimalPage } from './animal.page';

describe('AnimalPage', () => {
  let component: AnimalPage;
  let fixture: ComponentFixture<AnimalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
