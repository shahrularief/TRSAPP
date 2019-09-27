import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';
import { ImageModalPage } from '../../modals/image-modal/image-modal.page';
import { VerifyproductPage } from '../../modals/verifyproduct/verifyproduct.page';
import { ModalController } from '@ionic/angular';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult
} from 'ion2-calendar';

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
  jumProduks
  fail_lampiran;
  image;
  base64image;
  nota_tambahan;
  sales;
  pengesahan;
  sah = '';
  id: number;
  total: number;

  sortedcount: any = [];
  customers: any = [];
  unverifys: any = [];
  query: any = [];
  count: any = [];
  products: any = [];

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
    this.unverifys = [];
    this.count = [];
    this.sortedcount = [];
    this.products = [];
    this.loadCustomer();
    this.loadUnverify();
    this.loadProduct();
    this.getProduct();
  }


  onSearchTerm(ev: CustomEvent) {
    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.customers = this.customers.filter(term => {
        return term.company.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    } else {
      this.customers = [];
      this.loadCustomer();
    }
  }


  loadData(event: any) {

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

  loadUnverify() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getunverify',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(Cresult => {
        for (const verify of Cresult.result) {
          this.unverifys.push(verify);
          console.log('unverified items:' + this.unverifys);
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

  async openModal(img, serv, base64) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        serverid: serv,
        image: img,
        base64image: base64,
      }
    });
    return await modal.present().then(_ => {
      // triggered when opening the modal
      console.log('Sending data ');
      console.log(this.base64image);
    });
  }

  async totalProductModal() {
    let count = this.sortedcount;
    const modal = await this.modalController.create({
      component: VerifyproductPage,
      componentProps: {
        counted: count,
      }
    });
    return await modal.present().then(_ => {
      // triggered when opening the modal
      console.log('Sending data ');
    });
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'Pilih Tarikh',
      canBackwardsSelected: true,
    };

    const myCalendar = await this.modalController.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    let dateString: any = date.string;
    console.log(dateString);
    this.onSearchDate(dateString);

  }

  onSearchDate(from) {
    const val = from;
    if (val && val.trim() !== '') {
      this.customers = this.customers.filter(term => {
        return term.tarikh_order.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;

      });
      this.unverifys = [];

    } else {
      this.customers = [];
      this.loadCustomer();
    }
  }

  clearArrayCust() {
    this.customers = [];
    this.loadCustomer();
    this.unverifys = [];
    this.loadUnverify();
  }
  //get product array
  loadProduct() {
    return new Promise(resolve => {
      let body = {
        aksi: 'getproduct',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let product of data.result) {
          this.products.push(product);
          console.log(this.products);

        }
        resolve(true);
      });
    });
  }

  getProduct() {

    return new Promise(resolve => {
      let body = {
        aksi: 'getchoosenproductAcc',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let choose of data.result) {
          this.count.push(choose);

          console.log(this.count);
          let ch = [];

          this.count.forEach(function (a) {
            if (!this[a.produk]) {
              this[a.produk] = { produk: a.produk, jumProduk: 0 };
              ch.push(this[a.produk]);
            }
            this[a.produk].jumProduk += +a.jumProduk;
          }, Object.create(null));
          console.log('chranking', ch);
          this.sortedcount = ch.concat();
          this.sortedcount.sort(function (a, b) {
            return b.jumlah_bayaran - a.jumlah_bayaran;
          });
          console.log('Nranking', this.sortedcount);
        }
        resolve(true);
      });
    });
  }
}
