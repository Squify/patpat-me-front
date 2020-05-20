import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animal-profile',
  templateUrl: './animal-profile.page.html',
  styleUrls: ['./animal-profile.page.scss'],
})
export class AnimalProfilePage implements OnInit {

  private animal = {
    name: 'Pipoudou',
    birthday: '07/07/2019',
    type: 'Chat',
    breed: 'Sacré de Birmanie',
    gender: 'Mâle',
    nature: 'Câlin'
  };

  constructor() { }

  ngOnInit() {
  }

}
