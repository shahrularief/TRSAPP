import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostProvider } from '../../providers/post-provider';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';


const TOKEN_KEY = 'user-access-token';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  username: string;
  users: any;
  team: string;
  totalsum: any [];
  todaysum: any[];

  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    private toastCtrl: ToastController,
    private storage: Storage,
    private auth: AuthService
  ) { }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.totalsum = [];

    this.storage.get(TOKEN_KEY).then((res) => {
      this.users = res;
      this.username = this.users.username;
      this.team = this.users.team;
      console.log(res);
      this.loadTotalSale();
      this.todaysum = [];
      this.loadSaleToday();
    });
  }

  processLogout() {
    this.auth.signOut();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }

  loadTotalSale() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsum',
        sales_username: this.username,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let sum of data.result) {
          this.totalsum.push(sum);
          console.log('total' + this.totalsum);
        }
        resolve(true);
      });
    });
  }
  loadSaleToday() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumtoday',
        sales_username: this.username,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let sumT of data.result) {
          this.todaysum.push(sumT);
          console.log('total' + this.todaysum);
        }
        resolve(true);
      });
    });
  }



}
