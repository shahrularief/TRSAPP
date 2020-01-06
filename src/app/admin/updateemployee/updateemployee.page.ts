import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-updateemployee',
  templateUrl: './updateemployee.page.html',
  styleUrls: ['./updateemployee.page.scss'],
})
export class UpdateemployeePage implements OnInit {
  username;
  
  fullname;
  nickname;
  initUserName;
  initNickName;
  initUserHp;
  userhp;
  
  userEmail;
  role;
  company;
  id;
  password;
  confirm_password;
  source;
  data: any;
  companies: any[];
  isToggled;
  disToggled;
  isDisabled;
  isHide;
  toggle01: boolean = true;
  toggle02: boolean = false;

  constructor(private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    public toastCtrl: ToastController, ) {
    this.actRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;

        this.username = this.data.username;
        this.initUserName = this.data.username;
        this.fullname = this.data.fullname;
        this.nickname = this.data.nickname;
        this.initNickName = this.data.nickname;
        this.userhp = this.data.userhp;
        this.initUserHp = this.data.userhp;
        this.userEmail = this.data.userEmail;
        this.role = this.data.role;
        this.company = this.data.company;
        this.id = this.data.userID;
        this.password = this.data.password;
        this.confirm_password = this.data.password;
        this.source = this.data.source;
      }

    });

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.companies = [];
    this.loadTeam();
    this.toggle02 = true;
    this.toggle01 = false;
    this.checkRole();
  }

  checkRole() {
    if (this.role === "SALES" || this.role === "ACCOUNT" || this.role === "PRODUCTION") {
      this.isHide = false;
    } else {
      this.isHide = true;
    }
  }

  toggleOne() {
    this.toggle01 = !this.toggle02;
  }

  toggleTwo() {
    this.toggle02 = !this.toggle01;
  }

  notify(tog) {
    console.log(tog);
    if (tog === !this.isToggled) {
      this.isDisabled = true;
      console.log("isToggled false")
    } else {
      this.isDisabled = false;
      this.disToggled = true;
      console.log("isToggled true")
    }
  }
  async processUpdateEmployee() {
    console.log("isToggled", this.toggle01)

    if (this.toggle01 === true) {
      if (this.username !== '' && this.fullname !== '' && this.nickname !== '' && this.userhp !== ''
        && this.userEmail !== '' && this.role !== '' && this.company !== '' && this.password !== ' ' && this.confirm_password !== ' ') {
        let body = {
          aksi: 'updateemployee',
          userID: this.id,
          username: this.username,
          fullname: this.fullname,
          nickname: this.nickname,
          userhp: this.userhp,
          userEmail: this.userEmail,
          role: this.role,
          company: this.company,
          password: this.confirm_password,

        };
        const toast = await this.toastCtrl.create({
          message: 'Telah dikemaskini',
          duration: 2000
        });
        this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {
          this.updateordertable();
          if (this.source === 'employee') {
            this.router.navigate(['/employee']);
          } else {
            this.router.navigate(['/login']);
          }


          console.log('OK');

          toast.present();
        });


      } else {
        const toast = await this.toastCtrl.create({
          message: 'Isi semua ruangan kosong',
          duration: 2000
        });
        toast.present();

      }
    } else {
      if (this.username !== '' && this.fullname !== '' && this.nickname !== '' && this.userhp !== ''
        && this.userEmail !== '' && this.role !== '' && this.company !== '') {
        let body = {
          aksi: 'updateemployeenopassword',
          userID: this.id,
          username: this.username,
          fullname: this.fullname,
          nickname: this.nickname,
          userhp: this.userhp,
          userEmail: this.userEmail,
          role: this.role,
          company: this.company,
        };
        const toast = await this.toastCtrl.create({
          message: 'Telah dikemaskini',
          duration: 2000
        });
        this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {
          this.updateordertable();
          if (this.source === 'employee') {
            this.router.navigate(['/employee']);
          } else {
            this.router.navigate(['/login']);
          }
          console.log('OK');

          toast.present();
        });


      } else {
        const toast = await this.toastCtrl.create({
          message: 'Isi semua ruangan kosong',
          duration: 2000
        });
        toast.present();

      }
    }
  }


  loadTeam() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getcompany',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const comp of data.result) {
          this.companies.push(comp);
        }
        console.log(this.companies);
        resolve(true);
      });
    });
  }

 async updateordertable(){
    let body = {
      aksi: 'updateordertable',
      initsales: this.initUserName,
      initnickname: this.initNickName,
      initsaleshp: this.initUserHp,
      sales: this.username,
      nickname: this.nickname,
      saleshp: this.userhp,
    };
    this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {
      console.log('OK');

    });
  }
}
