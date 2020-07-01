import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Animal } from 'src/app/interfaces/animal/animal';
import { AnimalGender } from 'src/app/interfaces/animal/animal-gender';
import { AnimalType } from 'src/app/interfaces/animal/animal-type';
import { Breed } from 'src/app/interfaces/animal/breed';
import { Temper } from 'src/app/interfaces/animal/temper';
import { TypeService } from 'src/app/services/type/type.service';
import { AnimalService } from 'src/app/services/animal/animal.service';
import { GenderService } from 'src/app/services/gender/gender.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController } from '@ionic/angular';
import { UpdateService } from '../../services/update/update.service';
import { User } from '../../interfaces/user/user';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error/error.service';

@Component({
    selector: 'app-animal',
    templateUrl: './animal.page.html',
    styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {

    connectedUser: User;
    animalId: number;
    animal: Animal;

    constructor(
        private ngZone: NgZone,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private alertController: AlertController,
        private animalService: AnimalService,
        private errorService: ErrorService,
        private genderService: GenderService,
        private typeService: TypeService,
        private updateService: UpdateService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {

        this.animalId = +this.activatedRoute.snapshot.paramMap.get('id');
        if (!this.animalId)
            this.router.navigateByUrl('/tabs/profile');

        this.getConnectedUser();
        this.getAnimal();

        this.updateService.getObservable().subscribe((data) => {
            switch (data) {
                case 'updateAnimal':
                    this.getAnimal();
                    break;
                default:
                    break;
            }
        });
    }

    getAnimal(): void {

        this.animalService.getAnimalById(this.animalId).subscribe(
            value => this.animal = value,
            error => this.processError(error)
        );
    }

    getConnectedUser(): void {
        this.userService.getRemoteUser().subscribe(
            user => this.connectedUser = user,
            error => this.processError(error)
        )
    }

    isOwner(): boolean {

        return this.animal.owner.id == this.connectedUser.id;
    }

    deleteAnimal(): void {
        this.animalService.deleteAnimal(this.animalId).subscribe(
            _ => {
                this.updateService.publishSomeData('updateAnimal')
                this.router.navigateByUrl('/tabs/profile')
            },
            error => this.processError(error)
        );
    }


    async deleteAlert() {
        const alert = await this.alertController.create({
            header: this.translate.instant('ALERT.CONFIRMATION'),
            message: this.translate.instant('ALERT.REMOVE_ANIMAL'),
            buttons: [
                {
                    text: this.translate.instant('ALERT.CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: this.translate.instant('ALERT.CONFIRM'),
                    handler: () => {
                        this.deleteAnimal();
                    }
                }
            ]
        });

        await alert.present();
        await alert.onDidDismiss();
    }

    processError(error: HttpErrorResponse) {
        if (error) {
            switch (error.status) {
                case 400:
                    this.errorService.presentToast('back_input');
                    break;
                case 417:
                    this.errorService.presentToast('animal_back_user');
                    break;
                case 500:
                    this.errorService.presentToast('back_server');
                    break;
                default:
                    this.errorService.presentToast('back_unknown');
                    break;
            }
        } else {
            this.errorService.presentToast('back_unknown');
        }
    }
}
