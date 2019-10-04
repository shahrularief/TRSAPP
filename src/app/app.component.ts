import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from './services/auth.service';
import {NgxSpinnerService} from 'ngx-spinner';



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
  res: any;

  ordlabel = false;
  acclabel = false;
  prodlabel = false;
  perflabel = false;
  admlabel = false;

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
    // {
    //   title: 'Sales by Team',
    //   url: '/team',
    //   icon: 'business'
    // },
  ];

  public appPerform = [

  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private auth: AuthService,
    private menu: MenuController,
    public spinner: NgxSpinnerService,
  ) {
    this.initializeApp();
    this.loadUser();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.spinner.show();
    });
  }

  loadUser() {
    this.auth.authState.subscribe(state => {
      if (state) {
        this.router.navigate(['home']);
        this.res = state;
        this.username = state.username;
        this.role = state.role;
        console.log("appcomp", this.res);
        console.log("appcomp", this.username);
        console.log("appcomp", this.role);

        if (this.res !== null && this.role === 'SALES') {
          this.router.navigate(['/home']);
          
          this.ordlabel = true;
          this.appSales = [
            {
              title: 'Tempahan Baru',
              url: '/new-order',
              icon: 'add'
            },
            {
              title: 'Rekod Tempahan',
              url: '/rekod-order',
              icon: 'grid'
            },
          ];
          this.appPerform = [];
          this.appAccount = [];
          this.appProduction = [];
          this.appAdmin = [];
          

        } else if (this.res !== null && this.role === 'ACCOUNT') {
          this.router.navigate(['/home']);
          this.appSales = [];
          this.appPerform = [];

          this.acclabel = true;
          this.ordlabel = false;
          this.prodlabel = false;
          this.perflabel = false;
          this.admlabel = false;
          this.appAccount = [{
            title: 'Pengesahan',
            url: '/account-verify',
            icon: 'checkmark-circle'
          },
          {
            title: 'Shipping',
            url: '/shipping',
            icon: 'train'
          },
          ];
          this.appProduction = [
          ];
          this.appAdmin = [];

        } else if (this.res !== null && this.role === 'PRODUCTION') {
          this.router.navigate(['/home']);
          this.appPerform = [];
          this.ordlabel = true;
          this.acclabel = false;
          this.perflabel = false;
          this.admlabel = false;
          this.appSales = [
            {
              title: 'Tempahan Baru',
              url: '/new-order',
              icon: 'add'
            },
            {
              title: 'Rekod Tempahan',
              url: '/rekod-order',
              icon: 'grid'
            },
          ];

          this.appAccount = [];
          this.prodlabel = true;
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

        } else if (this.res !== null && this.role === 'CEO' || this.role === 'BOD' || this.role === 'DEV') {
          this.router.navigate(['/home']);
          this.ordlabel = true;
          
          this.appSales = [
            {
              title: 'Tempahan Baru',
              url: '/new-order',
              icon: 'add'
            },
            {
              title: 'Rekod Tempahan',
              url: '/rekod-order',
              icon: 'grid'
            },
          ];
          this.perflabel = true;
          this.appPerform = [{
            title: 'Sales by Team',
            url: '/salesteam',
            icon: 'people'
          },
          {
            title: 'Sales by Member',
            url: '/salesmember',
            icon: 'body'
          },
          ];
          this.acclabel = true;
          this.appAccount = [
            {
              title: 'Pengesahan',
              url: '/account-verify',
              icon: 'checkmark-circle'
            },
          ];
          this.prodlabel = true;
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
          this.admlabel = true;
          this.appAdmin = [
            {
              title: 'Staff Syarikat',
              url: '/employee',
              icon: 'person'
            },
            {
              title: 'Syarikat',
              url: '/viewcompany',
              icon: 'business'
            },
          ];
        }
      } else {
        this.router.navigate(['login']);
        this.appProduction = [];
        this.appAccount = [];
        this.appAdmin = [];
        this.appSales = [];
      }
    });
  }
}

