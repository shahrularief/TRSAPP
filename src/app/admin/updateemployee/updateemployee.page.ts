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
  userhp;
  userEmail;
  role;
  company;
  id;
  password;
  confirm_password;

  companies: any[];
  constructor(private postPrvdr: PostProvider,
              private router: Router,
              private actRoute: ActivatedRoute,
              public toastCtrl: ToastController, ) { }

  ngOnInit() {
    this.actRoute.params.subscribe((data: any) => {
      this.id = data.id;
      this.username = data.user;
      this.fullname = data.full;
      this.nickname = data.nick;
      this.userhp = data.hp;
      this.userEmail = data.emel;
      this.role = data.role;
      this.company = data.comp;
      this.password = data.pass;
      this.confirm_password = data.pass;
      console.log(data);
    });
  }

  ionViewWillEnter() {
    this.companies = [];
    this.loadTeam();
  }
 async processUpdateEmployee() {

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
          this.router.navigate(['/employee']);
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
}
