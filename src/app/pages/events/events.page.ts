import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-events',
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss']
})
export class EventsPage {

  events = [
    {
      "name": "Randonnée dans la prairie",
      "type": "Randonnée",
      "location": "Paris",
      "image": "",
      "date": "18-06-2020"
    },
    {
      "name": "Compétition pour chats",
      "type": "Jeux",
      "location": "Puteaux",
      "image": "",
      "date": "04-07-2020"
    }
  ]

  filters = [
    {
      "name": "",
      "label": "Randonnée",
      "value": false
    },
    {
      "name": "",
      "label": "Promenade",
      "value": false
    },
    {
      "name": "",
      "label": "Rencontre",
      "value": false
    },
    {
      "name": "",
      "label": "Jeux",
      "value": false
    },
    {
      "name": "",
      "label": "Pique nique",
      "value": false
    },
    {
      "name": "",
      "label": "Sortie en mer",
      "value": false
    }
  ];

  filterArgs = [

  ];

  constructor(private menu: MenuController) { }

  openFilter() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  updateArgs() {
    this.filterArgs = [];
    this.filters.forEach(filter => {
      if (filter.value === true) {
        this.filterArgs.push(filter.label);
      }
    });
  }
}
