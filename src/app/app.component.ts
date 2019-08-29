import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'user-access-token';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  role: string;
  users: any;

  public appPages = [
    {
      title: 'Utama',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Tempahan Baru',
      url: '/new-order',
      icon: 'add'
    },
    {
      title: 'Rekod Tempahan',
      url: '/rekod-order',
      icon: 'cart'
    },

    {
      title: 'Pengesahan',
      url: '/account-verify',
      icon: 'people'
    },
    {
      title: 'Production',
      url: '/production',
      icon: 'cube'
    },
    {
      title: 'Pendaftaran',
      url: '/registration',
      icon: 'add'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  loadUser() {
    this.storage.get(TOKEN_KEY).then((res) => {
      this.users = res;
      this.role = this.users.role;
      console.log(res);
    });
  }

}