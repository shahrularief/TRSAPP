import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import { PostProvider } from '../../../providers/post-provider';

@Component({
  selector: 'app-production',
  templateUrl: './production.page.html',
  styleUrls: ['./production.page.scss'],
})
export class ProductionPage implements OnInit {

  tarikh_order;
  nama_pelanggan;
  alamat_pelanggan;
  nombor_hp;
  akaun;
  produk;
  penghantaran;
  jumlah_bayaran;
  nota_tambahan;
  pengesahan;
  sah = '';
  id: number;
  total: number;
  sales;
  chProduk;

  customers: any = [];
  unverifiedprod: any = [];
  products: any[];
  stock: any[];
  sums: any[];
  count: any[];
  limit = 13; // LIMIT GET PERDATA
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
    this.customers = [];
    this.start = 0;
    this.loadCustomer();
    this.unverifiedprod = [];
    this.loadUnverify();
    this.loadProduct();
    this.products = [];
    this.count = [];
    this.sums= [];
    this.getSum();

  }

  onSearchTerm(ev: CustomEvent) {
    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.customers = this.customers.filter(term => {
        return term.sales_team.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
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
        aksi: 'getdataverified',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const customer of data.result) {
          this.customers.push(customer);
        }
        resolve(true);
      });
    });
  }
  loadUnverify() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getunverifyproduction',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(Cresult => {
        for (const verify of Cresult.result) {
          this.unverifiedprod.push(verify);
          console.log('unverified items production:' + this.unverifiedprod);
        }
        resolve(true);

      });
    });
  }


  updateOrder(id, nama, tarikh, alamat, hp, akaun, produk, penghantaran, bayaran, nota) {
    this.router.navigate(['/update-order/' + id + '/' + tarikh + '/' + nama + '/' + alamat + '/' + hp + '/' + akaun + '/'
      + produk + '/' + penghantaran + '/' + bayaran + '/' + nota]);
  }

  async openTrackModal(id, tracking) {
    const alert = await this.alertCtrl.create({
      header: 'Nombor Tracking',
      message: 'Masukkan nombor tracking',
      inputs: [
        {
          name: 'track',
          type: 'text',
          placeholder: 'Track',
        },
      ],
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancel');
          }
        }, {
          text: 'Tambah',
          handler: trackData => {
            tracking = 'tracking';
            this.trackOrder(id, trackData.track, tracking);
            this.openDeliveryModal(id, tracking);
            console.log(trackData.track);
          }
        }
      ]
    });

    await alert.present();
  }
  trackOrder(id, track, tracking) {
    return new Promise(resolve => {
      const body = {
        aksi: 'updatetracking',
        order_id: id,
        tracking: track,
        pengesahan: tracking,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        this.router.navigate(['/production']);
        this.ionViewWillEnter();
        console.log('OK' + data);
      });
    });
  }

  async openDeliveryModal(id, deliver) {
    const alert = await this.alertCtrl.create({
      header: 'Delivery',
      message: 'Pilih salah satu',
      inputs: [
        {
          name: 'poslaju',
          type: 'radio',
          label: 'Poslaju',
          value: 'Poslaju',
        },
        {
          name: 'ninjavan',
          type: 'radio',
          label: 'NinjaVan',
          value: 'NinjaVan'
        },
        {
          name: 'gdex',
          type: 'radio',
          label: 'GDEX',
          value: 'GDEX'
        },
      ],
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancel');
          }
        }, {
          text: 'Add',
          handler: hantar => {
            deliver = 'shipping';
            this.deliveryOrder(id, hantar, deliver),
              console.log(hantar);
          }
        }
      ]
    });

    await alert.present();
  }

  async deliveryOrder(id, hantar, deliver) {
    return new Promise(resolve => {
      const body = {
        aksi: 'updatedelivery',
        order_id: id,
        penghantaran: hantar,
        pengesahan: deliver,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        this.router.navigate(['/production']);
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
    const dateString: any = date.string;
    console.log(dateString);
    this.onSearchDate(dateString);

  }

  onSearchDate(from) {
    const val = from;
    if (val && val.trim() !== '') {
      this.customers = this.customers.filter(term => {
        return term.tarikh_order.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;

      });
      this.unverifiedprod = [];

    } else {
      this.customers = [];
      this.loadCustomer();
    }
  }

  clearArrayCust() {
    this.customers = [];
    this.loadCustomer();
    this.unverifiedprod = [];
    this.loadUnverify();
  }

  // get product array
  loadProduct() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getproduct',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const product of data.result) {
          this.products.push(product);
          console.log(this.products);

        }
        resolve(true);
      });
    });
  }

  getProduct(event) {
    console.log(event.detail.value);
    this.count = [];
    const chProduk = event.detail.value;
    return new Promise(resolve => {
      const body = {
        aksi: 'getchoosenproductProd',
        produk: chProduk,
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const choose of data.result) {
          this.count.push(choose);
          console.log(this.count);

        }
        resolve(true);
      });
    });
  }

  //GET TOTAL PAYMENT
  getSum() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumproduction',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.sums.push(sum);
          console.log(this.sums);

        }
        resolve(true);
      });
    });
  }

}
