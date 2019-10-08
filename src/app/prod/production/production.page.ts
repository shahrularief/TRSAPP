import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import * as papa from 'papaparse';
import { PostProvider } from '../../../providers/post-provider';
import { ProdProductPage } from '../../modals/prod-product/prod-product.page';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-production',
  templateUrl: './production.page.html',
  styleUrls: ['./production.page.scss'],
})
export class ProductionPage implements OnInit {
  date: Date = new Date();
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
  sortedcount: any = [];
  customers: any = [];
  unverifiedprod: any = [];
  products: any[];
  stock: any[];
  sums: any[];
  count: any[];
  headerRow;

  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  tableStyle = 'bootstrap';
  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    public loadCtrl: LoadingService,
    private plt: Platform,
    private file: File,
  ) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    this.customers = [];

    this.loadCustomer();
    this.unverifiedprod = [];
    this.loadUnverify();
    this.loadProduct();
    this.products = [];
    this.count = [];
    this.sums = [];
    this.getSum();
    this.sortedcount = [];
    this.getProduct();
  }

  

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    if (val && val.trim() !== '') {
      const temp = this.customers.filter(function (d) {
        return d.company.toLowerCase().indexOf(val) !== -1 || !val || d.nama_pelanggan.toLowerCase().indexOf(val) !== -1
        || d.sales.toLowerCase().indexOf(val) !== -1;
      });
      this.customers = temp;
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
      this.loadCtrl.present();
      const body = {
        aksi: 'getdataverified',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row['order_id'],
          tarikh_order: row['tarikh_order'],
          nama_pelanggan: row['nama_pelanggan'],
          alamat_pelanggan: row['alamat_pelanggan'],
          nombor_hp: row['nombor_hp'],
          akaun: row['akaun'],
          produk: row['produk'],
          penghantaran: row['penghantaran'],
          jumlah_bayaran: row['jumlah_bayaran'],
          jumProduk: row['jumProduk'],
          nota_tambahan: row['nota_tambahan'],
          sales: row['sales'],
          company: row['company'],
          fail_lampiran: row['fail_lampiran'],
          resit: row['resit'],
          pengesahan: row['pengesahan'],
          tracking: row['tracking']
        }));
      });
    });
  }
  loadUnverify() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getunverifyproduction',

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
          name: 'citylink',
          type: 'radio',
          label: 'CITYLINK',
          value: 'CITYLINK'
        },
        {
          name: 'dhl',
          type: 'radio',
          label: 'DHL',
          value: 'DHL'
        },
        {
          name: 'cod',
          type: 'radio',
          label: 'COD',
          value: 'COD'
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

  getProduct() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getchoosenproductProd',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const choose of data.result) {
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

  async totalProductModal() {
    let count = this.sortedcount;
    const modal = await this.modalController.create({
      component: ProdProductPage,
      componentProps: {
        counted: count,
      }
    });
    return await modal.present().then(_ => {
      // triggered when opening the modal
      console.log('Sending data ');
    });
  }


  //GET TOTAL PAYMENT
  getSum() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumproduction',
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
  downloadCSV() {
    let day = this.date.getDay();
    let month = this.date.getMonth() + 1;
    let year = this.date.getFullYear();


    console.log(day + '/' + month);
    let customersCSV = this.customers.map(row => ({
      order_id: row['order_id'],
      tarikh_order: row['tarikh_order'],
      nama_pelanggan: row['nama_pelanggan'],
      alamat_pelanggan: row['alamat_pelanggan'],
      nombor_hp: row['nombor_hp'],
      akaun: row['akaun'],
      produk: row['produk'],
      penghantaran: row['penghantaran'],
      jumlah_bayaran: row['jumlah_bayaran'],
      jumProduk: row['jumProduk'],
      nota_tambahan: row['nota_tambahan'],
      sales: row['sales'],
      company: row['company'],
      pengesahan: row['pengesahan'],
      tracking: row['tracking']
    }));

    console.log(customersCSV);
    let csv = papa.unparse({
      fields: this.headerRow,
      data: customersCSV,
    });

    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = day + '/' + month + '/' + year + '/' + "production.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

