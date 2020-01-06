import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
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
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-verify',
  templateUrl: './account-verify.page.html',
  styleUrls: ['./account-verify.page.scss'],
})
export class AccountVerifyPage implements OnInit {
  date: Date = new Date();
  accountname;
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
  loadedcustomers: any = [];
  unverifys: any = [];
  query: any = [];
  count: any = [];
  products: any = [];
  tableColumns: any[];
  tableStyle = 'bootstrap fullscreen';
  public searchTerm = '';
  server: string;
  headerRow;
  status;
  parameter;


  constructor(

    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private modalController: ModalController,
    public datatable: NgxDatatableModule,
    public loadCtrl: LoadingService,
    private auth: AuthService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.customers = [];
    this.loadedcustomers = [];
    this.unverifys = [];
    this.count = [];
    this.sortedcount = [];
    this.products = [];
    this.loadUnverify();
    this.loadProduct();
    this.getProduct();
    this.loadAccount();
    this.loadCustomerPending();
    this.status = 'status';

  }

  loadAccount() {
    this.auth.authState.subscribe(users => {

      this.accountname = users.username;
      console.log(this.accountname);
    });
  }
  loadCustomerAll() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getdataall',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {

        for (const customer of data.result) {
          this.customers.push(customer);

        }
        console.log('customers:' + this.customers);
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row['order_id'],
          tarikh_order: row['tarikh_order'],
          emel: row['emel'],
          nama_pelanggan: row['nama_pelanggan'],
          alamat_pelanggan: row['alamat_pelanggan'],
          poskod: row['poskod'],
          bandar: row['bandar'],
          negeri: row['negeri'],
          negara: row['negara'],
          nombor_hp: row['nombor_hp'],
          namaakaun: row['namaakaun'],
          masaakaun: row['masaakaun'],
          akaun: row['akaun'],
          produk: row['produk'],
          penghantaran: row['penghantaran'],
          jumlah_bayaran: row['jumlah_bayaran'],
          jumProduk: row['jumProduk'],
          nota_tambahan: row['nota_tambahan'],
          sales: row['sales'],
          company: row['company'],
          request: row['request'],
          resit: row['resit'],
          pengesahan: row['pengesahan'],
          tracking: row['tracking']
        }));

      });
    });
  }

  loadCustomerPending() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getdataunverified',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {

        for (const customer of data.result) {
          this.customers.push(customer);

        }
        console.log('customers:' + this.customers);
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row['order_id'],
          tarikh_order: row['tarikh_order'],
          emel: row['emel'],
          nama_pelanggan: row['nama_pelanggan'],
          alamat_pelanggan: row['alamat_pelanggan'],
          poskod: row['poskod'],
          bandar: row['bandar'],
          negeri: row['negeri'],
          negara: row['negara'],
          nombor_hp: row['nombor_hp'],
          namaakaun: row['namaakaun'],
          masaakaun: row['masaakaun'],
          akaun: row['akaun'],
          produk: row['produk'],
          penghantaran: row['penghantaran'],
          jumlah_bayaran: row['jumlah_bayaran'],
          jumProduk: row['jumProduk'],
          nota_tambahan: row['nota_tambahan'],
          sales: row['sales'],
          company: row['company'],
          request: row['request'],
          resit: row['resit'],
          pengesahan: row['pengesahan'],
          tracking: row['tracking']
        }));

      });
    });
  }


  loadCustomerCOD() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getdatacod',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {

        for (const customer of data.result) {
          this.customers.push(customer);

        }
        console.log('customers:' + this.customers);
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row['order_id'],
          tarikh_order: row['tarikh_order'],
          emel: row['emel'],
          nama_pelanggan: row['nama_pelanggan'],
          alamat_pelanggan: row['alamat_pelanggan'],
          poskod: row['poskod'],
          bandar: row['bandar'],
          negeri: row['negeri'],
          negara: row['negara'],
          nombor_hp: row['nombor_hp'],
          namaakaun: row['namaakaun'],
          masaakaun: row['masaakaun'],
          akaun: row['akaun'],
          produk: row['produk'],
          penghantaran: row['penghantaran'],
          jumlah_bayaran: row['jumlah_bayaran'],
          jumProduk: row['jumProduk'],
          nota_tambahan: row['nota_tambahan'],
          sales: row['sales'],
          company: row['company'],
          request: row['request'],
          resit: row['resit'],
          pengesahan: row['pengesahan'],
          tracking: row['tracking']
        }));

      });
    });
  }

  loadCustomerShipping() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getdatashipped',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {

        for (const customer of data.result) {
          this.customers.push(customer);

        }
        console.log('customers:' + this.customers);
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row['order_id'],
          tarikh_order: row['tarikh_order'],
          emel: row['emel'],
          nama_pelanggan: row['nama_pelanggan'],
          alamat_pelanggan: row['alamat_pelanggan'],
          poskod: row['poskod'],
          bandar: row['bandar'],
          negeri: row['negeri'],
          negara: row['negara'],
          nombor_hp: row['nombor_hp'],
          namaakaun: row['namaakaun'],
          masaakaun: row['masaakaun'],
          akaun: row['akaun'],
          produk: row['produk'],
          penghantaran: row['penghantaran'],
          jumlah_bayaran: row['jumlah_bayaran'],
          jumProduk: row['jumProduk'],
          nota_tambahan: row['nota_tambahan'],
          sales: row['sales'],
          company: row['company'],
          request: row['request'],
          resit: row['resit'],
          pengesahan: row['pengesahan'],
          tracking: row['tracking']
        }));

      });
    });
  }

  loadCustomerSah() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getdataverified',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {

        for (const customer of data.result) {
          this.customers.push(customer);

        }
        console.log('customers:' + this.customers);
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row['order_id'],
          tarikh_order: row['tarikh_order'],
          emel: row['emel'],
          nama_pelanggan: row['nama_pelanggan'],
          alamat_pelanggan: row['alamat_pelanggan'],
          poskod: row['poskod'],
          bandar: row['bandar'],
          negeri: row['negeri'],
          negara: row['negara'],
          nombor_hp: row['nombor_hp'],
          namaakaun: row['namaakaun'],
          masaakaun: row['masaakaun'],
          akaun: row['akaun'],
          produk: row['produk'],
          penghantaran: row['penghantaran'],
          jumlah_bayaran: row['jumlah_bayaran'],
          jumProduk: row['jumProduk'],
          nota_tambahan: row['nota_tambahan'],
          sales: row['sales'],
          company: row['company'],
          request: row['request'],
          resit: row['resit'],
          pengesahan: row['pengesahan'],
          tracking: row['tracking']
        }));

      });
    });
  }


  async openRequest(id, request) {
    const alert = await this.alertCtrl.create({
      header: 'Mesej',
      inputs: [
        {
          name: 'mesej',
          type: 'text',
          value: request
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            this.updateReq(id, data.mesej)
          }
        }
      ]
    });

    await alert.present();
  }

  updateReq(id, mesej) {
    let body = {
      aksi: 'updaterequest',
      order_id: id,
      request: mesej,
    };
    this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
      this.customers = [];
      this.unverifys = [];
      this.loadCustomerPending();
      this.loadUnverify();
    });
    ;
  }

  loadUnverify() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getunverify',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(Cresult => {
        for (const verify of Cresult.result) {
          this.unverifys.push(verify);

        }
        resolve(true);
        console.log('unverified items:' + this.unverifys);
      });
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log(val);
    if (val && val.trim() !== '') {
      const temp = this.customers.filter(d => {
        return d.company.toLowerCase().indexOf(val) !== -1 || !val
          || d.sales.toLowerCase().indexOf(val) !== -1;
      });
      this.customers = temp;
    } else {
      this.customers = [];
      this.loadCustomerPending();
    }
  }

  updateStatus(status) {

    if (status === 'pending') {
      this.customers = [];
      this.loadCustomerPending();
    } else if (status === 'sah') {
      this.customers = [];
      this.loadCustomerSah();
    } else if (status === 'shipping') {
      this.customers = [];
      this.loadCustomerShipping();
    } else if (status === 'all') {
      this.customers = [];
      this.loadCustomerAll();
    }
    else if (status === 'cod') {
      this.customers = [];
      this.loadCustomerCOD();
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      this.status = ' ';
      this.customers = [];
      this.ionViewWillEnter();
      event.target.complete();
    }, 3000);
  }

  updateOrder(id, nama, emel, tarikh, alamat, poskod, bandar, negeri, negara, hp, namaakaun, akaun, produk, penghantaran, bayaran, nota, sah, resit, masaakaun) {

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
      masaakaun: masaakaun,
      akaun: akaun,
      produk: produk,
      penghantaran: penghantaran,
      bayaran: bayaran,
      nota: nota,
      sah: sah,
      resit: resit,
    }
    let navigationExtras: NavigationExtras = {
      state: {
        user: details
      }
    };
    console.log("ne", navigationExtras)
    this.router.navigate(['update-order'], navigationExtras);
  }


  async verifyAlert(id) {
    const alert = await this.alertCtrl.create({
      header: 'Sahkan?',
      message: 'Sila pilih',
      inputs: [
        {
          name: 'sah',
          type: 'radio',
          label: 'Sah',
          value: 'sah',
          checked: true
        },
        {
          name: 'cod',
          type: 'radio',
          label: 'COD',
          value: 'cod'
        },
        {
          name: 'codship',
          type: 'radio',
          label: 'COD - Delivered',
          value: 'codship'
        },
      ],
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {


            console.log('Confirm Cancel', id);
          }
        }, {
          text: 'Sah',
          handler: data => {
            if (data === 'sah') {
              let sah = 'sah';
              this.verifyOrder(id, sah);
              console.log('Confirm Okay', id, sah);
            } else if (data === 'cod') {
              let sah = 'cod';
              this.verifyOrder(id, sah);
              console.log('Confirm Okay', id, sah);
            } else if (data === 'codship') {
              let sah = 'shipping';
              this.verifyOrder(id, sah);
              console.log('Confirm Okay', id, sah);
            }

          }
        }
      ]
    });

    await alert.present();
  }



  async verifyOrder(id, sah) {
    return new Promise(async resolve => {
      const body = {
        aksi: 'updateverify',
        order_id: id,
        pengesahan: sah,
        verified_by: this.accountname,
      };
      const toast = await this.toastCtrl.create({
        message: 'Error',
        duration: 2000
      });
      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {

        console.log('OK', data);
        let ds = data.success
        if (ds === true) {
          this.loadCtrl.present();
          this.customers = [];
          this.loadedcustomers = [];
          this.unverifys = [];
          this.loadUnverify();
          this.loadCustomerPending();
        } else {
          toast.present();
        }
        this.loadCtrl.dismiss();
      });
      resolve(true);


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

  async openModal(base64) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      componentProps: {
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
      pickMode: 'range',
      canBackwardsSelected: true,
      format: 'DD-MM-YYYY ',
    };

    const myCalendar = await this.modalController.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;

    const from: CalendarResult = event.data.from.string;

    const to: CalendarResult = event.data.to.string;
    console.log("date", from, to);
    let dateString: any = date.string;

    let tarF = this.datePipe.transform(from, 'dd-MM-yyyy');
    let tarT = this.datePipe.transform(to, 'dd-MM-yyyy');

    console.log(tarF, tarT);
    this.onSearchDate(tarF, tarT);

  }

  onSearchDate(tarF, tarT) {

    let start = tarF;
    let end = tarT;

    function parseDate(input) {
      var parts = input.match(/(\d+)/g);
      // note parts[1]-1
      return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }

    if (tarF !== '' && tarT !== '') {
      let startDate = parseDate(start);
      let endDate = parseDate(end);

      this.customers = this.customers.filter(m => {
        const current = parseDate(m.tarikh_order);
        return current >= startDate && current <= endDate;
      });

      console.log(this.customers);



    } else {
      this.unverifys = [];
      this.customers = [];
      this.loadCustomerPending();
    }
  }

  clearArrayCust() {
    setTimeout(() => {
      this.status = ' ';
      this.customers = [];
      this.ionViewWillEnter();

    }, 500);
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


        }
        console.log("productlist", this.products);
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
        }
        resolve(true);

        let pr = [];
        for (let pm of this.count) {
          pr.push(pm.produk)
        }
        console.log("pr", pr);

        let anArray = [];
        let parts;
        let secondparts;
        let ndArray = [];
        for (let i = 0; i < pr.length; i++) {
          parts = pr[i].split(",");

          for (let n = 0; n < parts.length; n++) {
            anArray.push(parts[n]);
            console.log("parts", parts);
          }
          console.log("anarray", anArray)
        }

        for (let i = 0; i < anArray.length; i++) {
          secondparts = anArray[i].split("-");
          ndArray.push({ produk: secondparts[0], total: secondparts[1] });
          console.log("2parts", ndArray);
        }
        let addprod = [];

        ndArray.forEach(function (a) {
          if (!this[a.produk]) {
            this[a.produk] = { produk: a.produk, total: 0 };
            addprod.push(this[a.produk]);
          }
          this[a.produk].total += +a.total;
        }, Object.create(null));
        console.log('addprod', addprod);
        this.sortedcount = addprod;
      });
    });
  }

  downloadCSV() {
    let date = new Date();
    let day = date.getDay() + 1;
    let month = date.getMonth() + 1;

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
      Status: row['pengesahan']
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
    a.download = day + '' + month + '' + "account" + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  colorStatus(status) {

    let col;
    if (status == 'pending') {
      return col = 'danger'
    } else if (status == 'sah') {
      return col = 'warning'
    } else if (status == 'shipping') {
      return col = 'success'
    } else if (status == 'cod') {
      return col = 'dark'
    } else if (status == 'codpending') {
      return col = 'tertiary'
    }

  }

  showBadge(req) {
    let show;
    if (req === '') {
      show = 'dark'
      return show;
    } else {
      show = 'danger'
      return show;

    }

  }
}
