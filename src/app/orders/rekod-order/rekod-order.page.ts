import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalpopupPage } from '../../modals/modalpopup/modalpopup.page';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-rekod-order',
  templateUrl: './rekod-order.page.html',
  styleUrls: ['./rekod-order.page.scss'],
})
export class RekodOrderPage implements OnInit {

  tarikh_order;
  nama_pelanggan;
  alamat_pelanggan;
  nombor_hp;
  akaun;
  produk;
  jumProduk;
  jumlah_bayaran;
  nota_tambahan;
  pengesahan;
  id: number;


  customers: any = [];
  limit: number = 13; // LIMIT GET PERDATA
  start: number = 0;

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController,
    private modalController: ModalController,
    public alertCtrl: AlertController,
  ) { }

  async openModal(id, nama, tarikh, alamat, hp, akaun, produk, jumProduk, bayaran, nota, resit, sah) {
    const modal = await this.modalController.create({
      component: ModalpopupPage,
      componentProps: {
        order_id: id,
        nama_pelanggan: nama,
        tarikh_order: tarikh,
        alamat_pelanggan: alamat,
        nombor_hp: hp,
        akaun: akaun,
        produk: produk,
        jumProduk: jumProduk,
        jumlah_bayaran: bayaran,
        nota_tambahan: nota,
        pengesahan: sah,
        base64image: resit,
      }
    });
    return await modal.present().then(_ => {
      // triggered when opening the modal
      console.log('Sending data ');
    });
  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    this.customers = [];
    this.start = 0; 
    this.loadCustomer();
  }

  updateCustomer(id, nama, tarikh, alamat, hp, akaun, produk, jumProduk, bayaran, nota) {
    this.router.navigate(['/update-order/' + id + '/' + tarikh + '/' + nama + '/' + alamat + '/' + hp + '/' + akaun + '/'
      + produk + '/' + jumProduk + '/' + bayaran + '/' + nota]);
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
            this.delCustomer(id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }

  loadData(event: any) {
    this.start += this.limit;
    setTimeout(() => {
      this.loadCustomer().then(() => {
        event.target.complete();
      });
    }, 500);
  }

  delCustomer(id) {
    let body = {
      aksi: 'delete',
      order_id: id
    };
    this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
      this.ionViewWillEnter();
    });
  }



  loadCustomer() {
    return new Promise(resolve => {
      let body = {
        aksi: 'getdataall',
        limit: this.limit,
        start: this.start,
      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        resolve(true);
      });
    });
  }
}

