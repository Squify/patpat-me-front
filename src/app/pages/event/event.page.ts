import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import { EventInterface } from '../../interfaces/event/event-interface';
import { EventType } from '../../interfaces/event/event-type';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  event: EventInterface;
  types: EventType[] = [];

  selectedSegment = 'informationSegment';
  type = 'Randonnée';
  url = '/src/assets/images/event-type/' + this.type + '.jpg';
  private img = '/assets/images/grumpy.jpg';
  private participants = [
    {
      avatar: '',
      pseudo: 'PetitPoney',
      role: ''
    },
    {
      avatar: '',
      pseudo: 'PetitChat',
      role: ''
    },
    {
      avatar: '',
      pseudo: 'PetitChien',
      role: ''
    },
    {
      avatar: '',
      pseudo: 'Chocolat',
      role: ''
    }
  ];

  constructor(
      private eventService: EventService,
  ) {
  }

  ngOnInit() {
    this.getTypes();
    this.getEvent();
  }

  getEvent(): void {

    this.eventService.getEventById(1).subscribe(
        value => {
          this.event = value;
        },
        e => console.log(e)
    );
  }

  getTypes(): void {
    this.eventService.getEventType().subscribe(
        val => {
          val.forEach((type) => {
                const typeToAdd: EventType = { name: type.name };
                this.types.push(typeToAdd);
              }
          );
        }
    );
  }

  segmentChanged(ev: any) {

    this.selectedSegment = ev.detail.value;
  }
}
