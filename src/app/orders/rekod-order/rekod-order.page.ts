import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';
import { Router, NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalpopupPage } from '../../modals/modalpopup/modalpopup.page';

import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import * as papa from 'papaparse';



@Component({
  selector: 'app-rekod-order',
  templateUrl: './rekod-order.page.html',
  styleUrls: ['./rekod-order.page.scss'],
})
export class RekodOrderPage implements OnInit {
  date: Date = new Date();
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
  username;
  role;
  company;
  loaderToShow: any;
  customers: any = [];
  users: any = [];
  tableStyle = 'bootstrap fullscreen';
  lockEdit = false;
  showWarn = false;

  headerRow;
  status;
  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastCtrl: ToastController,
    private modalController: ModalController,
    public alertCtrl: AlertController,
    public auth: AuthService,
    public loadCtrl: LoadingService,
  ) { }





  ngOnInit() {
    this.checkLock();
  }

  ionViewWillEnter() {
    this.customers = [];
    this.status = 'status';



    this.auth.authState.subscribe(state => {
      this.users = state;
      this.username = this.users.username;
      this.role = this.users.role;
      this.company = this.users.company;
      console.log("rekodcomp", this.company)

      if (this.role === "BOD") {

        this.loadCustomerAllPending();
      } else if (this.role === "CEO") {
        this.loadCustomerCEOPending(this.company);
      }
      else {
        this.loadCustomerPending(this.username);
      }
    });

  }
  async openModal(id, nama, emel, tarikh, alamat, poskod, bandar, negeri, negara, hp, namaakaun,
    akaun, produk, jumProduk, bayaran, nota, sah, track, resit, masaakaun, penghantaran) {
    console.log("resit", resit[0]);
    const modal = await this.modalController.create({
      component: ModalpopupPage,
      componentProps: {
        order_id: id,
        nama_pelanggan: nama,
        tarikh_order: tarikh,
        alamat_pelanggan: alamat,
        emel: emel,
        poskod: poskod,
        bandar: bandar,
        negara: negara,
        negeri: negeri,
        namaakaun: namaakaun,
        masaakaun: masaakaun,
        nombor_hp: hp,
        akaun: akaun,
        produk: produk,
        jumProduk: jumProduk,
        jumlah_bayaran: bayaran,
        nota_tambahan: nota,
        pengesahan: sah,
        tracking: track,
        base64image: resit,
        penghantaran: penghantaran,
      }
    });
    return await modal.present().then(_ => {
      // triggered when opening the modal
      console.log('Sending data', modal);
    });
  }

  async openNota(id, nota) {
    const alert = await this.alertCtrl.create({
      header: 'Mesej',
      inputs: [
        {
          name: 'mesej',
          type: 'text',
          value: nota
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
      aksi: 'updatenota',
      order_id: id,
      nota_tambahan: mesej,
    };
    this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
      this.ionViewWillEnter();
    });
    ;
  }

  async openRequest(id, req) {
    console.log(req)
    const alert = await this.alertCtrl.create({
      header: 'Nota akauntan',
      message: req,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


  updateOrder(id, nama, emel, tarikh, alamat, poskod, bandar, negeri, negara, hp, namaakaun, akaun, produk, penghantaran, bayaran, nota, sah, resit, masaakaun, prodCode) {

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
      prodCode: prodCode,
    }
    let navigationExtras: NavigationExtras = {
      state: {
        user: details
      }
    };
    console.log("ne", navigationExtras)
    this.router.navigate(['update-order'], navigationExtras);
  }

  updateStatus(status) {
    if (this.role === 'BOD') {
      console.log("BOD");
      if (status === 'pending') {
        this.customers = [];
        this.loadCustomerAllPending();
      } else if (status === 'sah') {
        this.customers = [];
        this.loadCustomerAllVerified();
      } else if (status === 'shipping') {
        this.customers = [];
        this.loadCustomerAllShipping();
      } else if (status === 'all') {
        this.customers = [];
        this.loadCustomerAll();
      }
      else if (status === 'cod') {
        this.customers = [];
        this.loadCustomerAllCod();
      }
    } else if (this.role === 'CEO') {
      console.log("ceo");
      if (status === 'pending') {
        this.customers = [];
        this.loadCustomerCEOPending(this.company);
      } else if (status === 'sah') {
        this.customers = [];
        this.loadCustomerCEOVerified(this.company);
      } else if (status === 'shipping') {
        this.customers = [];
        this.loadCustomerCEOShipping(this.company);
      } else if (status === 'all') {
        this.customers = [];
        this.loadCustomerCEO(this.company);
      }
      else if (status === 'cod') {
        this.customers = [];
        this.loadCustomerCEOCOD(this.company);
      }
    } else if (this.role === 'SALES') {
      console.log("sales");
      if (status === 'pending') {
        this.customers = [];
        this.loadCustomerPending(this.username);
      } else if (status === 'sah') {
        this.customers = [];
        this.loadCustomerVerified(this.username);
      } else if (status === 'shipping') {
        this.customers = [];
        this.loadCustomerShipping(this.username);
      } else if (status === 'all') {
        this.customers = [];
        this.loadCustomer(this.username);
      }
      else if (status === 'cod') {
        this.customers = [];
        this.loadCustomerCod(this.username);
      }
    }

  }
  checkLock() {
    var date = new Date();
    var hour = date.getHours();
    var day = date.getDay();
    console.log("hours now", hour)
    console.log("day now", day)

    if (day >= 1 && day <= 5) {
      if (hour >= 12 && hour < 18) {
        console.log("locked");
        this.lockEdit = !this.lockEdit;

      }
      else {
        console.log("unlocked");
        this.showWarn = !this.showWarn;
        this.lockEdit = this.lockEdit;

      }
    } else {

      console.log("unlocked");
      this.showWarn = !this.showWarn;
      this.lockEdit = this.lockEdit;


    }
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
      this.customers = [];
      this.ionViewWillEnter();
      event.target.complete();
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

  // SALES SALES SALES SALES /////////////////// SALES SALES SALES SALES /////////////////
  async loadCustomer(user) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallrecord',
        username: user,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);

        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          resit: row["resit"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }
  async loadCustomerPending(user) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallrecordpending',
        username: user,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);

        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          resit: row["resit"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }
  async loadCustomerVerified(user) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallrecordverified',
        username: user,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);

        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          resit: row["resit"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }
  async loadCustomerShipping(user) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallrecordshipping',
        username: user,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);

        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          resit: row["resit"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }

  async loadCustomerCod(user) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallrecordcod',
        username: user,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);

        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          resit: row["resit"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }
  // SALES SALES SALES SALES /////////////////// SALES SALES SALES SALES /////////////////


  //////CEO CEO CEO CEO  CEOC  CEO CEO CEOC CEO CEO /////////////////////////////////////
  async loadCustomerCEO(comp) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallceo',
        company: comp,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let cus of data.result) {
          this.customers.push(cus);
        }
        this.loadCtrl.dismiss();
        resolve(true);


        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }

  async loadCustomerCEOPending(comp) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallceopending',
        company: comp,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let cus of data.result) {
          this.customers.push(cus);
        }
        this.loadCtrl.dismiss();
        resolve(true);


        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }
  async loadCustomerCEOVerified(comp) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallceoverified',
        company: comp,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let cus of data.result) {
          this.customers.push(cus);
        }
        this.loadCtrl.dismiss();
        resolve(true);


        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }
  async loadCustomerCEOShipping(comp) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallceoshipping',
        company: comp,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let cus of data.result) {
          this.customers.push(cus);
        }
        this.loadCtrl.dismiss();
        resolve(true);


        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }

  async loadCustomerCEOCOD(comp) {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallceocod',
        company: comp,

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let cus of data.result) {
          this.customers.push(cus);
        }
        this.loadCtrl.dismiss();
        resolve(true);


        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          request: row["request"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"]
        }));
      });

    });
  }

  //////CEO CEO CEO CEO  CEOC  CEO CEO CEOC CEO CEO /////////////////////////////////////


  /////  BOD BOD BOD BOD BOD BOD BOD BOD BOD /////////////////////

  async loadCustomerAll() {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataall',

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"],
          request: row["request"],

        }));
      });
    });
  }

  async loadCustomerAllPending() {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallpending',

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"],
          request: row["request"],

        }));
      });
    });
  }
  async loadCustomerAllVerified() {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallverified',

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"],
          request: row["request"],

        }));
      });
    });
  }
  async loadCustomerAllShipping() {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallshipping',

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"],
          request: row["request"],

        }));
      });
    });
  }

  async loadCustomerAllCod() {
    return new Promise(resolve => {
      this.loadCtrl.present();
      let body = {
        aksi: 'getdataallcod',

      };

      this.postPvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let customer of data.result) {
          this.customers.push(customer);
        }
        this.loadCtrl.dismiss();
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row["order_id"],
          tarikh_order: row["tarikh_order"],
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
          prodCode: row["prodCode"],
          resit: row["resit"],
          penghantaran: row["penghantaran"],
          jumlah_bayaran: row["jumlah_bayaran"],
          jumProduk: row["jumProduk"],
          nota_tambahan: row["nota_tambahan"],
          sales: row["sales"],
          company: row["company"],
          pengesahan: row["pengesahan"],
          tracking: row["tracking"],
          request: row["request"],

        }));
      });
    });
  }

  /////  BOD BOD BOD BOD BOD BOD BOD BOD BOD //////////////////////////  BOD BOD BOD BOD BOD BOD BOD BOD BOD /////////////////////
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    if (val && val.trim() !== '') {
      const temp = this.customers.filter(function (d) {
        return d.nama_pelanggan.toLowerCase().indexOf(val) !== -1 || d.order_id.toLowerCase().indexOf(val) !== -1
          || d.sales.toLowerCase().indexOf(val) !== -1 ||
          d.pengesahan.toLowerCase().indexOf(val) !== -1 || !val;
      });
      this.customers = temp;
    } else {
      this.customers = [];
      if (this.role === "BOD") {

        this.loadCustomerAll();
      } else if (this.role === "CEO") {
        this.loadCustomerCEO(this.company);
      } else {
        this.loadCustomer(this.username);
      }
    }
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
      Emel: row["emel"],
      Alamat_Pelanggan: row['alamat_pelanggan'],
      Bandar: row["bandar"],
      Poskod: row["poskod"],
      Negeri: row["negeri"],
      Negara: row["negara"],
      Nombor_Hp: row['nombor_hp'],
      Nama_Akaun: row['namaakaun'],
      Akaun: row['akaun'],
      Tarikh_Bayaran: row['masaakaun'],
      Produk: row['produk'],
      Kod_Produk: row["prodCode"],
      Jumlah_Produk: row['jumProduk'],
      Bayaran: row['jumlah_bayaran'],
      Penghantaran: row['penghantaran'],
      Tracking: row['tracking'],
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
    a.download = day + '' + month + '' + this.username + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  showBadge(req) {
    let show;
    if (req === '') {
      show = 'mail'
      return show;
    } else {
      show = 'mail-unread'

      return show;
    }
  }

  badgeCol(req) {
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

