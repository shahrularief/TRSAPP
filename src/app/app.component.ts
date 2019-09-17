import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from './services/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const TOKEN_KEY = 'user-access-token';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  role: string;
  users: any;
  items: any;
  username: string;

  // public appAdmin = [];
  // public appAccount = [];
  // public appProduction = [];
  // public appSales = [];

  public appHome = [
    {
      title: 'Utama',
      url: '/home',
      icon: 'home'
    },
  ];
  public appSales = [
    // {
    //   title: 'Tempahan Baru',
    //   url: '/new-order',
    //   icon: 'add'
    // },
    // {
    //   title: 'Rekod Tempahan',
    //   url: '/rekod-order',
    //   icon: 'cart'
    // },
  ];

  public appAccount = [
    // {
    //   title: 'Pengesahan',
    //   url: '/account-verify',
    //   icon: 'people'
    // },
  ];

  public appProduction = [
    // {
    //   title: 'Production',
    //   url: '/production',
    //   icon: 'cube'
    // },
    // {
    //   title: 'Shipping',
    //   url: '/shipping',
    //   icon: 'train'
    // },

    // {
    //   title: 'Stok',
    //   url: '/stock',
    //   icon: 'filing'
    // },
  ];
  public appAdmin = [
    // {
    //   title: 'Pendaftaran',
    //   url: '/registration',
    //   icon: 'add'
    // },
    // {
    //   title: 'Syarikat',
    //   url: '/company',
    //   icon: 'business'
    // },
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
    // this.storage.clear();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.loadUser();
    });

  }

  loadUser() {
    this.storage.get(TOKEN_KEY).then((res) => {
      this.users = res;
      this.role = this.users.role;
      this.username = this.users.username;
      console.log(this.role);
      console.log(this.username);

      if (res == null) {
        this.router.navigate(['/login']);
        this.auth.signOut();
      } else {
        this.router.navigate(['/home']);


        if (this.role === 'TEAM SALES') {
          this.appSales = [
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

          this.appAccount = [];
          this.appProduction = [];
          this.appAdmin = [];

        } else if (this.role === 'ACCOUNT') {
          this.appSales = [];

          this.appAccount = [{
            title: 'Pengesahan',
            url: '/account-verify',
            icon: 'people'
          },
          {
            title: 'Shipping',
            url: '/shipping',
            icon: 'train'
          },];
          this.appProduction = [];
          this.appAdmin = [];

        } else if (this.role === 'PRODUCTION') {
          this.appSales = [
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

          this.appAccount = [];
          this.appProduction = [
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
          this.appAdmin = [];

        } else if (this.role === 'CEO' || this.role === 'BOD') {
          this.appSales = [
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

          this.appAccount = [
            {
              title: 'Pengesahan',
              url: '/account-verify',
              icon: 'people'
            },
          ];

          this.appProduction = [
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
          this.appAdmin = [
            {
              title: 'Pendaftaran',
              url: '/registration',
              icon: 'add'
            },
            {
              title: 'Syarikat',
              url: '/company',
              icon: 'business'
            },
          ];
        }
      }

    });
  }
}
