import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from './services/auth.service';

const TOKEN_KEY = 'user-access-token';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  role: string;
  users: any;
  username: string;

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
  ];

  public appAccount = [
    {
      title: 'Pengesahan',
      url: '/account-verify',
      icon: 'people'
    },
  ];

  public appProduction = [
    {
      title: 'Production',
      url: '/production',
      icon: 'cube'
    },
    {
      title: 'Shipping',
      url: '/shipping',
      icon: 'train'
    },

    {
      title: 'Stok',
      url: '/stock',
      icon: 'filing'
    },
  ];
  public appAdmin = [
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
    private auth: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.username = '';

    });
    this.storage.get(TOKEN_KEY).then((res) => {
      if (res == null) {
        this.router.navigate(['/login']);
        this.auth.signOut();
      } else {
        this.router.navigate(['/home']);
        this.loadUser();
      }
    });
  }

  loadUser() {
    this.storage.get(TOKEN_KEY).then((res) => {
      this.users = res;
      this.role = this.users.role;
      this.username = this.users.username;
      console.log(res);
    });
  }
}
