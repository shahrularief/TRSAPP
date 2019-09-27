import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  registrationSegment: string;
  slider1 = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
  };
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
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.loadTeam();
    this.companies = [];
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
        aksi: 'registeremployee',
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
