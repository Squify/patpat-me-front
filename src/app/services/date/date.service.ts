import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DateService {

    constructor(
        private translate: TranslateService
    ) {
    }

    getMinDate(): any {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        today.setHours(0, 0, 0);

        return formatDate(today, 'yyyy-MM-dd', 'en-US', 'Europe/Paris');
    }

    getMaxDate(): any {
        const today = new Date();
        today.setFullYear(today.getFullYear() + 10);
        today.setHours(23, 59, 59);

        return formatDate(today, 'yyyy-MM-dd', 'en-US', 'Europe/Paris');
    }

    calculateAge(birthday) { // birthday is a date

        if (birthday) {

            let today: any = new Date();
            let bday: any = new Date(birthday)

            let nbJours = Math.floor((today - bday) / (1000 * 60 * 60 * 24))
            let nbSemaines = Math.floor(nbJours / 7)
            let nbMois = Math.floor(nbJours / 30)
            if (nbMois < 1) {
                if (nbJours == 0) {
                    return this.translate.instant('ANIMAL.AGE.NEWBORN')
                } else if (nbSemaines == 0) {
                    return nbJours + ' ' + (nbJours == 1 ? this.translate.instant('ANIMAL.AGE.DAY') : this.translate.instant('ANIMAL.AGE.DAYS'))
                }
                return nbSemaines + ' ' + (nbSemaines == 1 ? this.translate.instant('ANIMAL.AGE.WEEK') : this.translate.instant('ANIMAL.AGE.WEEKS'));
            } else if (nbMois < 12) {
                return nbMois + ' ' + this.translate.instant('ANIMAL.AGE.MONTH');
            } else {
                let age = Math.floor(nbMois / 12)
                return age + ' ' + (age == 1 ? this.translate.instant('ANIMAL.AGE.YEAR') : this.translate.instant('ANIMAL.AGE.YEARS'));
            }
        }

        return this.translate.instant('ANIMAL.AGE.N/A');
    }
}
