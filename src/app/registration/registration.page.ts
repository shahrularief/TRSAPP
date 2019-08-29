import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  registrationSegment: string;

  username = '';
  password = '';
  confirm_password = '';
  role = '';
  company = '';

  accprod_username = '';
  accprod_role = '';
  accprod_password = '';
  confirm_accprod_password = '';
  accprod_hp = '';
  accprod_email = '';

  sales_username = '';
  sales_password = '';
  confirm_sales_password = '';
  sales_role = '';
  sales_company = '';
  sales_hp = '';
  sales_email = '';


  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.registrationSegment = 'admin';
  }

  async processRegisterAdmin() {
    // validation done
    if (this.username === '') {
      const toast = await this.toastCtrl.create({
        message: 'Username is required',
        duration: 3000
      });
      toast.present();
    } else if (this.password === '') {
      const toast = await this.toastCtrl.create({
        message: 'Password is required',
        duration: 3000
      });
      toast.present();
    } else if (this.password !== this.confirm_password) {
      const toast = await this.toastCtrl.create({
        message: 'Invalid password',
        duration: 3000
      });
      toast.present();
    } else {

      const body = {
        username: this.username,
        password: this.password,
        role: this.role,
        company: this.company,
        aksi: 'registeradmin'
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(async data => {
        let alertpesan = data.msg;
        if (data.success) {
          this.router.navigate(['/login']);
          const toast = await this.toastCtrl.create({
            message: 'Register succesful',
            duration: 3000
          });
          toast.present();
        } else {
          const toast = await this.toastCtrl.create({
            message: alertpesan,
            duration: 3000
          });
          toast.present();
        }
      });

    }

  }

  async processRegisterAccProd() {
    // validation done
    if (this.accprod_username === '') {
      const toast = await this.toastCtrl.create({
        message: 'Username is required',
        duration: 3000
      });
      toast.present();
    } else if (this.accprod_password === '') {
      const toast = await this.toastCtrl.create({
        message: 'Password is required',
        duration: 3000
      });
      toast.present();
    } else if (this.accprod_password !== this.confirm_accprod_password) {
      const toast = await this.toastCtrl.create({
        message: 'Invalid password',
        duration: 3000
      });
      toast.present();
    } else {

      const body = {
        accprod_username: this.accprod_username,
        accprod_password: this.accprod_password,
        accprod_role: this.accprod_role,
        accprod_hp: this.accprod_hp,
        accprod_email: this.accprod_email,
        aksi: 'registeraccprod'
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(async data => {
        let alertpesan = data.msg;
        if (data.success) {
          this.router.navigate(['/login']);
          const toast = await this.toastCtrl.create({
            message: 'Register succesful',
            duration: 3000
          });
          toast.present();
        } else {
          const toast = await this.toastCtrl.create({
            message: alertpesan,
            duration: 3000
          });
          toast.present();
        }
      });

    }

  }

  async processRegisterSales() {
    // validation done
    if (this.sales_username === '') {
      const toast = await this.toastCtrl.create({
        message: 'Username is required',
        duration: 3000
      });
      toast.present();
    } else if (this.sales_password === '') {
      const toast = await this.toastCtrl.create({
        message: 'Password is required',
        duration: 3000
      });
      toast.present();
    } else if (this.sales_password !== this.confirm_sales_password) {
      const toast = await this.toastCtrl.create({
        message: 'Invalid password',
        duration: 3000
      });
      toast.present();
    } else {

      const body = {
        sales_username: this.sales_username,
        sales_password: this.sales_password,
        sales_role: this.sales_role,
        sales_company: this.sales_company,
        sales_hp: this.sales_hp,
        sales_email: this.sales_email,
        aksi: 'registersales'
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(async data => {
        let alertpesan = data.msg;
        if (data.success) {
          this.router.navigate(['/login']);
          const toast = await this.toastCtrl.create({
            message: 'Register succesful',
            duration: 3000
          });
          toast.present();
        } else {
          const toast = await this.toastCtrl.create({
            message: alertpesan,
            duration: 3000
          });
          toast.present();
        }
      });

    }

  }

}
