import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    @ViewChild('myTabs', null) tabs: IonTabs;
    activeTabName: string;

    eventsIcon = 'home-outline';
    eventsIconSelected = 'home';
    eventsIsSelected = false;

    meetIcon = 'people-outline';
    meetIconSelected = 'people';
    meetIsSelected = false;

    friendsIcon = 'heart-outline';
    friendsIconSelected = 'heart';
    friendsIsSelected = false;

    profileIcon = 'person-outline';
    profileIconSelected = 'person';
    profileIsSelected: boolean = false;


    constructor() {
    }

    getSelectedTab(): void {

        this.activeTabName = this.tabs.getSelected();

        switch (this.activeTabName) {
            case 'events':
                this.meetIsSelected = false;
                this.friendsIsSelected = false;
                this.profileIsSelected = false;
                this.eventsIsSelected = true;
                break;
            case 'meet':
                this.meetIsSelected = true;
                this.friendsIsSelected = false;
                this.profileIsSelected = false;
                this.eventsIsSelected = false;
                break;
            case 'friends':
                this.meetIsSelected = false;
                this.friendsIsSelected = true;
                this.profileIsSelected = false;
                this.eventsIsSelected = false;
                break;
            case 'profile':
                this.meetIsSelected = false;
                this.friendsIsSelected = false;
                this.profileIsSelected = true;
                this.eventsIsSelected = false;
                break;
            default:
                this.meetIsSelected = false;
                this.friendsIsSelected = false;
                this.profileIsSelected = false;
                this.eventsIsSelected = false;
                break;
        }
    }

}
