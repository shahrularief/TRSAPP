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

  // sample data for testing slider

  ///////

  username: string;
  users: any;
  team: string;
  totalsum: any = [];


  slides = [
    {
      title: 'Total Sales',
      text: '10000000000'
    },
    {
      title: 'Total Customer',
      text: ''
    },
    {
      title: 'Total something',
      text: 'RM'
    },
  ]


  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    private toastCtrl: ToastController,
    private storage: Storage,
    private auth: AuthService
  ) { }

  ngOnInit() {
    // this.loadTotal();
  }


  ionViewWillEnter() {
    this.storage.get(TOKEN_KEY).then((res) => {
      this.users = res;
      this.username = this.users.username;
      this.team = this.users.team;
      console.log(res);
    });
  }

  processLogout() {
    this.auth.signOut();
  }

  loadTotal() {
    return new Promise(resolve => {
      let body = {
        aksi: 'getsum',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let sum of data.result) {
          this.totalsum.return(sum);
        }
        resolve(true);
      });
    });
  }



}
