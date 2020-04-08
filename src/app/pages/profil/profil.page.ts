import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  user: User;
  subscriptionUser: Subscription;

  constructor(
    private userService: UserService,
    readonly appComponent: AppComponent
  ) {
  }

  segmentChanged(ev: any) {
      console.log('Segment changed', ev);
  }

  ngOnInit() {

    //this.subscriptionUser = this.userService.getUser().subscribe(user => this.user = user);
  }

}
