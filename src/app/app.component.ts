import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {TranslateService} from "@ngx-translate/core";
import * as algoliasearch from 'algoliasearch/lite';
import { LanguageService } from './services/language/language.service';

const searchClient = algoliasearch(
    '1NYEVZJLJB',
    '0472793286e31e13588bf58e077efea3'
);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  config = {
    indexName: 'patpat-me',
    searchClient
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.initializeApp();

    this.languageService.setLanguage();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
