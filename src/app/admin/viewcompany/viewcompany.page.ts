import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';

@Component({
  selector: 'app-viewcompany',
  templateUrl: './viewcompany.page.html',
  styleUrls: ['./viewcompany.page.scss'],
})
export class ViewcompanyPage implements OnInit {

  companies: any[];
  limit = 20; // LIMIT GET PERDATA
  start = 0;
  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
   this.companies = [];
   this.start = 0;
   this.loadCompany();
  }

  loadCompany() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getcompany',
        limit: this.limit,
        start: this.start
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const comp of data.result) {
          this.companies.push(comp);
          console.log('Products:' + this.companies);
        }
        resolve(true);
      });
    });
  }


  onSearchTerm(ev: CustomEvent) {
    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.companies = this.companies.filter(term => {
        return term.compName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    } else {
      this.companies = [];
      this.loadCompany();
    }
  }

}
