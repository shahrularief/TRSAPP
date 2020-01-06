import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from './services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
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
  avatar: string;
  res: any;
  

  content: string;
  misc: string;
  full_icon = "expand";
  ordlabel = false;
  acclabel = false;
  prodlabel = false;
  perflabel = false;
  admlabel = false;


  public appHome = [
    {
      title: 'Utama',
      url: '/home',
      icon: 'home'
    },
  ];
  public appSales = [
  ];

  public appAccount = [
  ];

  public appProduction = [
  ];
  public appAdmin = [

  ];

  public appPerform = [

  ];

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private auth: AuthService,
    private menu: MenuController,
    public spinner: NgxSpinnerService,
    public alertController: AlertController,
    private sanitizer: DomSanitizer,
  ) {
    this.initializeApp();
    this.loadUser();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.spinner.show();
      console.log(this.platform.platforms());
    });
  }

  fullscreen() {
    if (this.content === "content-body" && this.misc === "misc-body") {
      this.content = "full-screen";
      this.misc = " ";
      this.full_icon = "contract"
    } else if (this.content === "full-screen" && this.misc === " ") {
      this.content = "content-body";
      this.misc = "misc-body";
      this.full_icon = "expand"
    }

  }

  loadUser() {
    this.auth.authState.subscribe(state => {
      if (state) {
        this.router.navigate(['home']);
        this.res = state;
        this.username = state.username;
        this.role = state.role;
        let imageData = state.avatar;
        this.sanitizer.bypassSecurityTrustResourceUrl(imageData);
        this.avatar = 'data:image/jpeg;base64,' + imageData;

        console.log("appcompres", this.res);
        console.log("appcompuser", this.username);
        console.log("appcomprole", this.role);

        if (this.res !== null && this.role === 'SALES') {
          this.router.navigate(['/home']);

          if (this.platform.is("android")) {
            this.content = "fullscreen";
            this.misc = " ";
            this.full_icon = " ";
          } else if (this.platform.is("cordova") || this.platform.is("desktop")) {
            this.content = "content-body";
            this.misc = "misc-body";
            this.full_icon = "expand";
          }

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
          this.content = "full-screen";
          this.misc = " ";
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
          this.appProduction = [];
          this.appAdmin = [];

        } else if (this.res !== null && this.role === 'ACCOUNT HEAD') {
          this.router.navigate(['/home']);
          this.appSales = [];
          this.appPerform = [];
          this.content = "full-screen";
          this.misc = " ";
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
          {
            title: 'Report',
            url: '/account-report',
            icon: 'document'
          }
          ];
          this.appProduction = [
            {
              title: 'Stok',
              url: '/stock',
              icon: 'filing'
            },
          ];
          this.appAdmin = [];

        }

        else if (this.res !== null && this.role === 'PRODUCTION') {
          this.router.navigate(['/home']);
          this.appPerform = [];
          this.content = "full-screen";
          this.misc = " ";
          this.ordlabel = false;
          this.acclabel = false;
          this.perflabel = false;
          this.admlabel = false;
          this.appSales = [];

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
          ];
          this.appAdmin = [];

        } else if (this.res !== null && this.role === 'PRODUCTION HEAD') {
          this.router.navigate(['/home']);
          this.appPerform = [];
          this.content = "full-screen";
          this.misc = " ";
          this.ordlabel = false;
          this.acclabel = false;
          this.perflabel = false;
          this.admlabel = false;
          this.appSales = [];

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

        } 
        else if (this.res !== null && this.role === 'CEO' || this.role === 'BOD' || this.role === 'DEV') {
          this.router.navigate(['/home']);
          this.ordlabel = true;
          this.content = "full-screen";
          this.misc = " ";
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
            title: 'Jualan Team',
            url: '/salesteam',
            icon: 'people'
          },
          {
            title: 'Jualan Ahli',
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
        else if (this.res !== null && this.role === 'HR') {
          this.router.navigate(['/home']);
          this.appPerform = [];
          this.content = "full-screen";
          this.misc = " ";
          this.ordlabel = false;
          this.acclabel = false;
          this.perflabel = false;
          this.admlabel = false;
          this.appSales = [];
          this.appAccount = [];
          this.prodlabel = false;
          this.appProduction = [];
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

  goToProfile(){
    this.router.navigate(['view-profile']);
  }
}

