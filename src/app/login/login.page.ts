import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  image: string;
  username = '';
  fullname = '';
  nickname = '';
  userhp = '';
  userEmail = '';
  password = '';
  confirm_password = '';
  role = '';
  company = '';

  companies: any[];

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    private toastCtrl: ToastController,
    private storage: Storage,
    private auth: AuthService,
    private menu: MenuController,

  ) { this.image = '../assets/trsgold.png'; 

 
}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menu.swipeGesture(false);
    this.loadTeam();
    this.companies = [];
  }


  // LOGIN Employee
  async processLoginEmployee() {
    if (this.username !== '' && this.password !== '') {
      const body = {

        username: this.username,
        password: this.password,
        aksi: 'loginemployee'
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(async data => {
        const alertmessage = data.msg;
        if (data.success) {
          this.signInEmployee(data.result);
          const toast = await this.toastCtrl.create({
            message: 'Log masuk berjaya!',
            duration: 2000
          });
          toast.present();
          this.username = '';
          this.password = '';
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
  signInEmployee(data) {
    this.auth.signInEmployee(data).subscribe(user => {
      console.log(user);
    });
  }

  async processRegisterEmployee() {
    // validation done
    if (this.username === '') {
      const toast = await this.toastCtrl.create({
        message: '*Username',
        duration: 3000
      });
      toast.present();
    } else if (this.password === '') {
      const toast = await this.toastCtrl.create({
        message: '*Password',
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
        aksi: 'registerlogin',
        username: this.username,
        password: this.password,
        fullname: this.fullname,
        nickname: this.nickname,
        userhp: this.userhp,
        userEmail: this.userEmail,
        role: this.role,
        company: this.company,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(async data => {
        let alertpesan = data.msg;
        if (data.success) {
          this.router.navigate(['/login']);
          const toast = await this.toastCtrl.create({
            message: 'Pendaftaran berjaya',
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


  loadTeam() {
    return new Promise(resolve => {
      let body = {
        aksi: 'getcompany',
      
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let comp of data.result) {
          this.companies.push(comp);
        }
        console.log(this.companies);
        resolve(true);
      });
    });
  }

}
