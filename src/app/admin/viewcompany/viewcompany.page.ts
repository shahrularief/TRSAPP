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

    this.loadCompany();
  }

  updateCompany(id, nama, reg , addr, city, pc,stat, hp, ms, me,) {
    this.router.navigate(['/updatecomp/' + id + '/' + nama + '/' + reg + '/' + addr + '/' + city + '/' + pc + '/'
    + stat + '/' + hp + '/' + ms + '/' + me]);
  }


  loadCompany() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getcompany',

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

  viewCompany() {
    this.router.navigate(['/company']);
  }

  async deleteAlert(id) {
    const alert = await this.alertCtrl.create({
      header: 'Delete!',
      message: 'Adakah anda pasti?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteCompany(id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
  deleteCompany(id) {
    let body = {
      aksi: 'deletecompany',
      compID: id
    };
    this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
      this.ionViewWillEnter();
    });
  }
}
