import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import * as papa from 'papaparse';
import { AuthService } from 'src/app/services/auth.service';
import { PostProvider } from '../../../providers/post-provider';
import { ProdProductPage } from '../../modals/prod-product/prod-product.page';
import { LoadingService } from '../../services/loading.service';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-production',
  templateUrl: './production.page.html',
  styleUrls: ['./production.page.scss'],
})
export class ProductionPage implements OnInit {

  @ViewChild('filechooser', { static: false }) fileChooserElementRef: ElementRef;

  selected = [];
  dataList: any[];
  date: Date = new Date();
  fileCSV;
  prod_username;
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
  collect: any = [];
  transaction: any = [];
  sortedcount: any = [];
  customers: any = [];
  unverifiedprod: any = [];
  products: any[];
  currproducts: any[];
  stock: any[];
  sums: any[];
  count: any[];
  deliver: string;
  filechoosen: any;
  csvData: any[] = [];
  headerRow;
  isChecked: false;
  checkbox: string[] = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  tableStyle = 'bootstrap fullscreen';
  private fileTransfer: FileTransferObject;
  uploaded: boolean;
  prodText = '1) Upload file .csv sahaja <br> 2) Jangan tukar header dalam file csv <br>'
  status;
  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    public loadCtrl: LoadingService,
    private auth: AuthService,
    private transfer: FileTransfer,
    private http: Http,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.customers = [];
    this.collect = [];
    this.currproducts = [];
    this.transaction = [];
    this.loadProduction();
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
    this.status = 'status';
  }


  doRefresh(event) {
    setTimeout(() => {
      this.customers = [];
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
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

  updateStatus(status) {

    if (status === 'pending') {
      this.customers = [];
      this.loadCustomerPending();
    } else if (status === 'sah') {
      this.customers = [];
      this.loadCustomer();
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
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    console.log('onSelect', this.selected[0].sales)
    this.arraytosubmit();

  }

  onActivate(event) {
    console.log('Activate Event', event);
  }


  updateArray(e, track, id, deliver, produk) {
    if (e.target.checked === true) {
      console.log(e.target.checked);
      this.collect.push({ track, deliver, id, produk });
      console.log(this.collect);
      this.arraytosubmit();
    } else {
      e.target.checked = false;
      console.log(e.target.checked);

      var index = this.collect.map(x => {
        return x.id;
      }).indexOf(id);

      this.collect.splice(index, 1);
      console.log(this.collect);
    }


  }

  arraytosubmit() {
    console.log('collected', this.selected);

    let proArr = [];
    for (let pro of this.selected) {
      proArr.push(pro.produk);
    }
    console.log('proArr', proArr)

    let anArray = [];
    let parts;
    let secondparts;
    let ndArray = [];

    for (let i = 0; i < proArr.length; i++) {
      parts = proArr[i].split(',');

      for (let n = 0; n < parts.length; n++) {
        anArray.push(parts[n]);
        console.log('parts', parts);
      }
      console.log('anarray', anArray)

    }

    for (let i = 0; i < anArray.length; i++) {
      secondparts = anArray[i].split('-');
      ndArray.push({ produk: secondparts[0], total: secondparts[1] });
      console.log('2parts', ndArray);
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
    this.transaction = addprod.concat();
    console.log('transaction', this.transaction);
  }

  submitProcedure() {
    this.submitTransaction();
    this.submitCollected();

  }

  updateProduct(prod, out) {

    console.log('update', prod, out)

    return new Promise(resolve => {
      const body = {
        aksi: 'getproduct',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const product of data.result) {
          this.currproducts.push(product);
        }
        resolve(true);
        console.log('this.currproducts', this.currproducts);

        function isProd(curr) {
          return curr.prodName === prod.trim();
        }

        let fetch = this.currproducts.find(isProd);
        let fetchname = fetch.prodName;
        console.log('FETCH?', fetchname);


        this.UpdateStock(out, fetchname)
      });
    });
  }

  UpdateStock(out, fetchname) {
    return new Promise(async resolve => {
      const body = {
        aksi: 'updatestockout',
        stock_out: out,
        prodName: fetchname,
      };
      const toast = await this.toastCtrl.create({
        message: 'Error',
        duration: 2000
      });

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        console.log('updatestock', data);
        let ds = data.success;
        if(ds === true){
          this.customers = [];
          this.unverifiedprod = [];
          this.selected = [];
          this.loadCustomer();
         
        }else{
          toast.present();
        }

      });
      resolve(true);
  
      
    });
  }
  submitTransaction() {
    console.log('transaction', this.transaction);
    let txtype = 'keluar';

    return new Promise(resolve => {
      for (let n = 0; n < this.transaction.length; n++) {
        let body = {
          aksi: 'outtransaction',
          txproduct: this.transaction[n].produk,
          txtotal: this.transaction[n].total,
          txtype: txtype,
          txname: this.prod_username,
        };

        this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
          console.log('tx', data)


        });
        this.updateProduct(this.transaction[n].produk, this.transaction[n].total);
      }
      resolve(true);

    });
  }

  submitCollected() {
    console.log('collected', this.selected);
    let sah;


    return new Promise(resolve => {
      for (let n = 0; n < this.selected.length; n++) {
        if(this.selected[n].pengesahan === 'sah' && this.selected[n].tracking !== ''  && this.selected[n].penghantaran !== ''){
          sah = "shipping"
        }else if(this.selected[n].pengesahan === 'cod' && this.selected[n].tracking !== ''  && this.selected[n].penghantaran !== ''){
          sah = "codpending"
        }
        let body = {
          aksi: 'updateproduction',
          order_id: this.selected[n].order_id,
          tracking: this.selected[n].tracking,
          penghantaran: this.selected[n].penghantaran,
          pengesahan: sah,
          shipped_by: this.prod_username,
        };

        this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {

          console.log('OK' + data);
        });
      }
      resolve(true);
      this.unverifiedprod = [];
      this.loadUnverify();
      this.sums = [];
      this.getSum();
    });

  }

  loadData(event: any) {
    setTimeout(() => {
      this.loadCustomer().then(() => {
        event.target.complete();
      });
    }, 500);
  }

  loadProduction() {
    this.auth.authState.subscribe(users => {
      this.prod_username = users.username;
      console.log('production', this.prod_username);
    });
  }

  loadCustomer() {
    this.loadCtrl.present();
    return new Promise(resolve => {
      const body = {
        aksi: 'getdataverified',
      };
      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const customer of data.result) {
          this.customers.push(customer);
        }
        resolve(true);
        this.loadCtrl.dismiss();
        this.customers = this.customers.map(row => ({
          order_id: row['order_id'],
          tarikh_order: row['tarikh_order'],
          nama_pelanggan: row['nama_pelanggan'],
          emel: row['emel'],
          alamat_pelanggan: row['alamat_pelanggan'],
          bandar: row['bandar'],
          poskod: row['poskod'],
          negeri: row['negeri'],
          negara: row['negara'],
          nombor_hp: row['nombor_hp'],
          namaakaun: row['namaakaun'],
          masaakaun: row['masaakaun'],
          akaun: row['akaun'],
          produk: row['produk'],
          prodCode: row['prodCode'],
          penghantaran: row['penghantaran'],
          jumlah_bayaran: row['jumlah_bayaran'],
          jumProduk: row['jumProduk'],
          nota_tambahan: row['nota_tambahan'],
          sales: row['sales'],
          nickname: row['nickname'],
          sales_hp: row['sales_hp'],
          company: row['company'],
          resit: row['resit'],
          request: row['request'],
          pengesahan: row['pengesahan'],
          tracking: row['tracking']
        }));
        console.log('masaakaun prod', this.customers.masaakaun)
      });
    });
  }

  loadCustomerAll() {
    this.loadCtrl.present();
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
        this.loadCtrl.dismiss();
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
    this.loadCtrl.present();
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
        this.loadCtrl.dismiss();
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
    this.loadCtrl.present();
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
        this.loadCtrl.dismiss();
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
    this.loadCtrl.present();
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
        this.loadCtrl.dismiss();
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
     
    }
    let navigationExtras: NavigationExtras = {
      state: {
        user: details
      }
    };
    console.log('ne', navigationExtras)
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

        }
        resolve(true);
        let pr = [];
        for (let pm of this.count) {
          pr.push(pm.produk)
        }
        console.log('pr', pr);

        let anArray = [];
        let parts;
        let secondparts;
        let ndArray = [];

        for (let i = 0; i < pr.length; i++) {
          parts = pr[i].split(',');

          for (let n = 0; n < parts.length; n++) {
            anArray.push(parts[n]);
            console.log('parts', parts);
          }
          console.log('anarray', anArray)

        }

        for (let i = 0; i < anArray.length; i++) {
          secondparts = anArray[i].split('-');
          ndArray.push({ produk: secondparts[0], total: secondparts[1] });
          console.log('2parts', ndArray);
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
    let date = new Date();
    let day = date.getDay() + 1;
    let month = date.getMonth() + 1;

    console.log(day + '/' + month);
    let customersCSV = this.customers.map(row => ({
      Order_ID: row['order_id'],
      Tarikh_Order: row['tarikh_order'],
      Sales: row['sales'],
      Pengirim: row['nickname'],
      Nama_Pelanggan: row['nama_pelanggan'],
      Nombor_Hp: row['nombor_hp'],
      Alamat_Pelanggan: row['alamat_pelanggan'],
      Poskod: row['poskod'],
      Bandar: row['bandar'],
      Negeri: row['negeri'],
      Negara: row['negara'],
      Nama_Akaun: row['namaakaun'],
      Akaun: row['akaun'],
      Tarikh_Bayaran: row['masaakaun'],
      Produk: row['produk'],
      Kod: row['prodCode'],
      Bil_produk: row['jumProduk'],
      Bayaran: row['jumlah_bayaran'],
      Penghantaran: row['penghantaran'],
      Track: row['tracking'],
      Nota_Tambahan: row['nota_tambahan'],
      Company: row['company'],
      Status: row['pengesahan'],
    }));

    console.log('csv', customersCSV.Akaun);
    console.log('csv', customersCSV);
    let csv = papa.unparse({
      fields: this.headerRow,
      data: customersCSV,
    });

    // Dummy implementation for Desktop download purpose
    var blob = new Blob([csv]);
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = day + '_' + month + '_' + this.prod_username + 'production' + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  onChange(files: any[]) {

    if (files[0]) {
      console.log(files[0]);
      papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {
          console.log(result);
          this.dataList = result.data;
          console.log('data', this.dataList);

          this.customers = [];
          this.customers = this.dataList.map(row => ({
            order_id: row['Order_ID'],
            tarikh_order: row['Tarikh_Order'],
            nama_pelanggan: row['Nama_Pelanggan'],
            nombor_hp: row['Nombor_Hp'],
            alamat_pelanggan: row['Alamat_Pelanggan'],
            poskod: row['Poskod'],
            bandar: row['Bandar'],
            negeri: row['Negeri'],
            negara: row['Negara'],
            namaakaun: row['Nama_Akaun'],
            akaun: row['Akaun'],
            masaakaun: row['Tarikh_Bayaran'],
            produk: row['Produk'],
            jumProduk: row['Bil_produk'],
            jumlah_bayaran: row['Bayaran'],
            penghantaran: row['Penghantaran'],
            tracking: row['Track'],
            nota_tambahan: row['Nota_Tambahan'],
            nickname: row['Pengirim'],
            sales: row['Sales'],
            company: row['Company'],
            pengesahan: row['Status'],
          }));
          console.log('uploadCSV', this.customers)

        }
      });
    }
  }


}
