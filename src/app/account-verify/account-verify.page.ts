import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PostProvider } from '../../providers/post-provider';
import { ImageModalPage } from '../modals/image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-account-verify',
  templateUrl: './account-verify.page.html',
  styleUrls: ['./account-verify.page.scss'],
})
export class AccountVerifyPage implements OnInit {

  tarikh_order;
  nama_pelanggan;
  alamat_pelanggan;
  nombor_hp;
  akaun;
  produk;
  penghantaran;
  fail_lampiran;
  image;
  nota_tambahan;
  sales;
  pengesahan;
  sah = '';
  id: number;
  total: number;

  customers: any = [];
  query: any = [];
  limit = 20; // LIMIT GET PERDATA
  start = 0;

  public searchTerm = '';
  server: string;


  constructor(

    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private modalController: ModalController,

  ) { this.server = postPrvdr.server; }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.customers = [];
    this.start = 0;
    this.loadCustomer();

  }

  onSearchTerm(ev: CustomEvent) {
    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.customers = this.customers.filter(term => {
        return term.nama_pelanggan.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    } else {
      this.customers = [];
      this.loadCustomer();
    }
  }


  loadData(event: any) {
    this.start += this.limit;
    setTimeout(() => {
      this.loadCustomer().then(() => {
        event.target.complete();
      });
    }, 500);
  }


  loadCustomer() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getdataunverified',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const customer of data.result) {
          this.customers.push(customer);
          console.log('customers:' + this.customers);
        }
        resolve(true);
      });
    });
  }

  updateOrder(id, nama, tarikh, alamat, hp, akaun, produk, penghantaran, bayaran, nota) {
    this.router.navigate(['/update-order/' + id + '/' + tarikh + '/' + nama + '/' + alamat + '/' + hp + '/' + akaun + '/'
      + produk + '/' + penghantaran + '/' + bayaran + '/' + nota]);
  }

  async verifyAlert(id, sah) {
    const alert = await this.alertCtrl.create({
      header: 'Sahkan?',
      message: 'Sila pilih',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            sah = 'belum disahkan';
            this.verifyOrder(id, sah);
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Sah',
          handler: () => {
            sah = 'sah';
            this.verifyOrder(id, sah);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }



  async verifyOrder(id, sah) {
    return new Promise(resolve => {
      const body = {
        aksi: 'updateverify',
        order_id: id,
        pengesahan: sah,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        this.router.navigate(['/account-verify']);
        this.ionViewWillEnter();
        console.log('OK');
      });
    });

  }

  async deleteOrder(id) {

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
            this.delCustomer(id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  delCustomer(id) {
    const body = {
      aksi: 'delete',
      order_id: id
    };
    this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
      this.ionViewWillEnter();
    });
  }

  async openModal(img, serv) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        serverid: serv,
        image: img,
      }
    });
    return await modal.present().then(_ => {
      // triggered when opening the modal
      console.log('Sending data ');
    });
  }
}
