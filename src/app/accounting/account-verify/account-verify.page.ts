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
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import * as papa from 'papaparse';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-account-verify',
  templateUrl: './account-verify.page.html',
  styleUrls: ['./account-verify.page.scss'],
})
export class AccountVerifyPage implements OnInit {
  date: Date = new Date();

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
showload = true;
  sortedcount: any = [];
  customers: any = [];
  unverifys: any = [];
  query: any = [];
  count: any = [];
  products: any = [];
  tableColumns: any[];
  tableStyle = 'bootstrap';
  public searchTerm = '';
  server: string;
  headerRow

  constructor(

    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private modalController: ModalController,
    public datatable: NgxDatatableModule,
    public loadCtrl: LoadingService,

  ) { this.server = postPrvdr.server; }

  ngOnInit() {
    console.log(this.date);
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
        aksi: 'getdataunverified',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const customer of data.result) {
          this.customers.push(customer);
          console.log('customers:' + this.customers);
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
          pengesahan: row['pengesahan']
        }));
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    if (val && val.trim() !== '') {
      const temp = this.customers.filter(function (d) {
        return d.company.toLowerCase().indexOf(val) !== -1 || !val;
      });
      this.customers = temp;
    } else {
      this.customers = [];
      this.loadCustomer();
    }
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
    console.log(id);
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
      pengesahan: row['pengesahan']
    }));

    console.log(customersCSV);
    let csv = papa.unparse({
      fields: this.headerRow,
      data: customersCSV,
    });

    // Dummy implementation for Desktop download purpose
    let blob = new Blob([csv]);
    let a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = day + '/' +  month +  '/' +  year + '/' + "account.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
