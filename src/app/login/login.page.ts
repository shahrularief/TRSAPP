import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginsegment: string;

  user = {
    username: '',
    password: '',
    role: ''
  };

  accprod_username: string = "";
  accprod_password: string = "";

  sales_username: string = "";
  sales_password: string = "";

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    private toastCtrl: ToastController,
    private storage: Storage,
    private auth: AuthService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loginsegment = 'admin';
  }

  // LOGIN ADMIN
  async processLoginAdmin() {
    if (this.user.username !== '' && this.user.password !== '') {
      let body = {

        username: this.user.username,
        password: this.user.password,
        aksi: 'loginadmin'
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(async data => {
        var alertmessage = data.msg;
        if (data.success) {
          this.signInAdmin(data.result);
          const toast = await this.toastCtrl.create({
            message: 'Log masuk berjaya!',
            duration: 2000
          });
          toast.present();
          this.user.username = '';
          this.user.password = '';
          console.log(data);
        } else {
          const toast = await this.toastCtrl.create({
            message: alertmessage,
            duration: 2000
          });
          toast.present();
        }
      });

    } else {
      const toast = await this.toastCtrl.create({
        message: 'ID Pengguna atau kata laluan salah',
        duration: 2000
      });
      toast.present();
    }

  }
  signInAdmin(data) {
    this.auth.signInAdmin(data).subscribe(user => {
      let role = user['role'];
      if (role === 'BOD') {
        this.router.navigateByUrl('/home');
      } else if (role === 'CEO') {
        this.router.navigateByUrl('/rekod-order');
      }
    });
  }
  // LOGIN ACC & PROD
  async processLoginAccProd() {
    if (this.accprod_username !== '' && this.accprod_username !== '') {
      let body = {

        accprod_username: this.accprod_username,
        accprod_password: this.accprod_password,
        aksi: 'loginaccprod'
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(async data => {
        var alertmessage = data.msg;
        if (data.success) {
          this.signInAccProd(data.result);
          const toast = await this.toastCtrl.create({
            message: 'Log masuk berjaya!',
            duration: 2000
          });
          toast.present();
          this.user.username = '';
          this.user.password = '';
          console.log(data);
        } else {
          const toast = await this.toastCtrl.create({
            message: alertmessage,
            duration: 2000
          });
          toast.present();
        }
      });

    } else {
      const toast = await this.toastCtrl.create({
        message: 'ID Pengguna atau kata laluan salah',
        duration: 2000
      });
      toast.present();
    }

  }

  signInAccProd(data) {
    this.auth.signInAccProd(data).subscribe(user => {
      let role = user['role'];
      if (role === 'ACCOUNT') {
        this.router.navigateByUrl('/account-verify');
      } else if (role === 'PRODUCTION') {
        this.router.navigateByUrl('/production');
      }
    });
  }

  // LOGIN SALES
  async processLoginSales() {
    if (this.sales_username !== '' && this.sales_password !== '') {
      let body = {

        sales_username: this.sales_username,
        sales_password: this.sales_password,
        aksi: 'loginsales'
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(async data => {
        var alertmessage = data.msg;
        if (data.success) {
          this.signInSales(data.result);
          const toast = await this.toastCtrl.create({
            message: 'Log masuk berjaya!',
            duration: 2000
          });
          toast.present();
          this.sales_username = '';
          this.sales_password = '';
          console.log(data);
        } else {
          const toast = await this.toastCtrl.create({
            message: alertmessage,
            duration: 2000
          });
          toast.present();
        }
      });

    } else {
      const toast = await this.toastCtrl.create({
        message: 'ID Pengguna atau kata laluan salah',
        duration: 2000
      });
      toast.present();
    }

  }
  signInSales(data) {
    this.auth.signInSales(data).subscribe(user => {
      let role = user['role'];
      if (role == 'TEAM SALES') {
        this.router.navigateByUrl('/new-order');
      } else if (role == 'SALES LEADER') {
        this.router.navigateByUrl('/new-order');
      }
    });
  }



}