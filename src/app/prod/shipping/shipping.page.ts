import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import { PostProvider } from '../../../providers/post-provider';
import * as papa from 'papaparse';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.page.html',
  styleUrls: ['./shipping.page.scss'],
})
export class ShippingPage implements OnInit {
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
  tacking;
  sah = '';
  id: number;
  total: number;
  sums: any = [];

  customers: any = [];
  shipCount: any = [];
  tableStyle = 'bootstrap';
  headerRow
  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    private datePipe: DatePipe,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.shipCount = [];
    this.customers = [];
    this.sums = [];

    this.loadCustomer();
    this.loadShipped();
    this.getSum();
  }

  loadData(event: any) {

    setTimeout(() => {
      this.loadCustomer().then(() => {
        event.target.complete();
      });
    }, 500);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.customers = [];
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }
  loadCustomer() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getdatashipped',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const customer of data.result) {
          this.customers.push(customer);

        }
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
          verified_by: row["verified_by"],
          tarikh_verify: row["tarikh_verify"],
          shipped_by: row["shipped_by"],
          tarikh_shipping: row["tarikh_shipping"],
          nama_pelanggan: row["nama_pelanggan"],
          emel: row["emel"],
          alamat_pelanggan: row["alamat_pelanggan"],
          bandar: row["bandar"],
          poskod: row["poskod"],
          negeri: row["negeri"],
          negara: row["negara"],
          nombor_hp: row["nombor_hp"],
          namaakaun: row["namaakaun"],
          masaakaun: row["masaakaun"],
          akaun: row["akaun"],
          produk: row["produk"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          sales_hp: row["sales_hp"],
          company: row["company"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });
    });
  }

  loadShipped() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getshippedcount',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(Cresult => {
        for (const verify of Cresult.result) {
          this.shipCount.push(verify);
          console.log('unverified items production:' + this.shipCount);
        }
        resolve(true);

      });
    });
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
    let tar = this.datePipe.transform(dateString, 'dd-MM-yyyy');
    console.log(tar);
    this.onSearchDate(tar);
  }

  onSearchDate(from) {
    const val = from;
    if (val && val.trim() !== '') {
      this.customers = this.customers.filter(term => {
        return term.tarikh_order.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;

      });


    } else {
      this.customers = [];
      this.loadCustomer();
    }
  }

  clearArrayCust() {
    this.customers = [];
    this.loadCustomer();
    this.shipCount = [];
    this.loadShipped();
  }

  updateOrder(id, nama, emel, tarikh, alamat, poskod, bandar, negeri, negara, hp, namaakaun, akaun, produk, penghantaran, bayaran, nota, sah) {

    let details = {
      order_id: id,
      nama: nama,
      emel: emel,
      tarikh: tarikh,
      alamat: alamat,
      poskod: poskod,
      bandar: bandar,
      negeri: negeri,
      negara: negara,
      hp: hp,
      namaakaun: namaakaun,
      akaun: akaun,
      produk: produk,
      penghantaran: penghantaran,
      bayaran: bayaran,
      nota: nota,
      sah: sah,
    }
    let navigationExtras: NavigationExtras = {
      state: {
        user: details
      }
    };
    console.log("ne", navigationExtras)
    this.router.navigate(['update-order'], navigationExtras);
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


  //GET TOTAL PAYMENT
  getSum() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumship',

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
    let date = new Date();
    let day = date.getDay() + 1;
    let month = date.getMonth() + 1;

    let alamatTRS = 'NO.15 1 ST FLOOR, JALAN SERI PUTRA 1/4,BANDAR SERI PUTRA, 43000 KAJANG'

    console.log(day + '/' + month);
    let customersCSV = this.customers.map(row => ({
      Order_ID: row['order_id'],
      Tarikh_Order: row['tarikh_order'],
      Nama_Pelanggan: row['nama_pelanggan'],
      Nombor_Hp: row['nombor_hp'],
      Alamat_Pelanggan: row['alamat_pelanggan'],
      Poskod: row['poskod'],
      Bandar: row['bandar'],
      Negeri: row['negeri'],
      Negera: row['negera'],
      Nama_Akaun: row['namaakaun'],
      Akaun: row['akaun'],
      Tarikh_Bayaran: row['masaakaun'],
      Produk: row['produk'],
      Jumlah_Produk: row['jumProduk'],
      Bayaran: row['jumlah_bayaran'],
      Penghantaran: row['penghantaran'],
      Track: row['tracking'],
      Nota_Tambahan: row['nota_tambahan'],
      Sales: row['sales'],
      Company: row['company'],
      Alamat: alamatTRS,
      Status: row['pengesahan'],
      Account: row["verified_by"],
      Tarikh_Sah: row["tarikh_verify"],
      Production: row["shipped_by"],
      Tarikh_Delivery: row["tarikh_shipping"],
    }));


    console.log("csv", customersCSV);
    let csv = papa.unparse({
      fields: this.headerRow,
      data: customersCSV,
    });

    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = day + '' + month + '' + "shipping" + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  printReceipt(id, nama, emel, tarikh, alamat, poskod, bandar, negeri, negara, hp, namaakaun, akaun, produk, jumProduk, bayaran, sales, penghantaran, track ) {
    let details = {
      order_id: id,
      nama: nama,
      emel: emel,
      tarikh: tarikh,
      alamat: alamat,
      poskod: poskod,
      bandar: bandar,
      negeri: negeri,
      negara: negara,
      hp: hp,
      namaakaun: namaakaun,
      akaun: akaun,
      produk: produk,
      jumProduk: jumProduk,
      penghantaran: penghantaran,
      bayaran: bayaran,
      sales: sales,
      track: track,
    }
    let navigationExtras: NavigationExtras = {
      state: {
        user: details
      }
    };
    console.log("ne", navigationExtras);
    this.router.navigate(['receipt'], navigationExtras);
  }

}
