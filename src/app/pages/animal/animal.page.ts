import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-animal',
    templateUrl: './animal.page.html',
    styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {

    animalId: number;

    constructor(
        public router: Router,
        private activatedRoute: ActivatedRoute,
        private ngZone: NgZone,
    ) {
    }

    ngOnInit() {
        this.animalId = +this.activatedRoute.snapshot.paramMap.get('id');
    }

    ionViewDidEnter() {
        if (history.state.comingFromEdition) {
            // this.ngZone.run(() => this.getAnimal())
        }
    }

}
