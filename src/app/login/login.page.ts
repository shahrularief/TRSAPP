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
  avatarimage: any;

  username = '';
  password = '';

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    private toastCtrl: ToastController,
    private storage: Storage,
    private auth: AuthService,
    private menu: MenuController,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menu.swipeGesture(false);
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
}
