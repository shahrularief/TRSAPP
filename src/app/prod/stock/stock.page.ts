import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss']
})
export class StockPage implements OnInit {
  products: any[];
  username;
  userrole;
  dinner: any;
  role = false;
  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private modalController: ModalController,
    private auth: AuthService,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.products = [];
    this.getUser();
    this.loadProduct();
  }
  getUser() {
    this.auth.authState.subscribe(data => {
      this.username = data.username;
      this.userrole = data.role;
      console.log(this.username);
    });

    if (this.userrole === 'CEO' || this.userrole === 'BOD' || this.userrole === 'PRODUCTION HEAD') {
      this.role = false;
    } else {
      this.role = true
    }
  }


  doRefresh(event) {
    setTimeout(() => {
      this.products = [];
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }

  onSearchTerm(ev: CustomEvent) {
    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.products = this.products.filter(term => {
        return (
          term.prodName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1
        );
      });
    } else {
      this.products = [];
      this.loadProduct();
    }
  }
  loadProduct() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getproduct',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const prod of data.result) {
          this.products.push(prod);
          console.log('Products:' + this.products);
        }
        resolve(true);
      });
    });
  }

  async openAddProduct() {
    const alert = await this.alertCtrl.create({
      header: 'Tambah Produk',
      inputs: [
        {
          name: 'prodName',
          type: 'text',
          placeholder: 'Nama Produk'
        },
        {
          name: 'prodCode',
          type: 'text',
          placeholder: 'Kod Produk'
        },
        {
          name: 'prodStock',
          type: 'number',
          placeholder: 'Stok Produk'
        },
        {
          name: 'kos_founder',
          type: 'number',
          placeholder: 'Kos Founder'
        },
        {
          name: 'kos_company',
          type: 'number',
          placeholder: 'Kos Intercompany'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: async data => {
            if (
              data.prodName !== '' &&
              data.prodCode !== '' &&
              data.prodStock !== ''
            ) {
              console.log('Confirm Ok');
              this.newProduct(data);
              console.log(data);
              
            } else {
              const toast = await this.toastCtrl.create({
                message: 'Isi ruang kosong',
                duration: 2000
              });
              toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async EditProduct(prodID, kos_founder, kos_company, prodName, prodCode) {
    const alert = await this.alertCtrl.create({
      header: 'Edit' + '-' + prodName,
      inputs: [
        {
          name: 'prodName',
          type: 'text',
          value: prodName
        },
        {
          name: 'prodCode',
          type: 'text',
          value: prodCode
        },
        {
          name: 'kos_founder',
          type: 'number',
          placeholder: "Founder" + ' ' + kos_founder
        },
        {
          name: 'kos_company',
          type: 'number',
          placeholder: "Company" + ' ' +kos_company
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Ok',
          handler: async data => {
            if (
              data.prodName !== '' &&
              data.prodCode !== '' &&
              data.kos_founder !== ''
              &&
              data.kos_company !== ''
            ) {
              console.log('Confirm Ok');
              this.editedProduct(data, prodID);
              console.log(data);
              
            } else {
              const toast = await this.toastCtrl.create({
                message: 'Isi ruang kosong',
                duration: 2000
              });
              toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editedProduct(data, prodID) {
    console.log(data);
    const body = {
      aksi: 'editproduct',
      prodID: prodID,
      prodCode: data.prodCode,
      prodName: data.prodName,
      kos_founder: data.kos_founder,
      kos_company: data.kos_company
    };

    this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {
      this.router.navigate(['/stock']);
      console.log('OK');
      console.log(data);
      this.products = [];
      this.loadProduct();

      const toast = await this.toastCtrl.create({
        message: 'Produk telah dikemaskini',
        duration: 2000
      });
      toast.present();
    });
  }



  async newProduct(data) {
    console.log(data);
    const body = {
      aksi: 'addproduct',
      prodCode: data.prodCode,
      prodStock: data.prodStock,
      prodName: data.prodName,
      kos_founder: data.kos_founder,
      kos_company: data.kos_company
    };

    this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {
      this.router.navigate(['/stock']);
      console.log('OK');
      console.log(data);
      this.products = [];
      this.loadProduct();

      const toast = await this.toastCtrl.create({
        message: 'Produk telah disimpan',
        duration: 2000
      });
      toast.present();
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
          handler: blah => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.delProduct(id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  delProduct(id) {
    const body = {
      aksi: 'deleteProd',
      prodID: id
    };
    this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
      this.ionViewWillEnter();
    });
  }


  async addAlert(id, stock, prodName) {
    const alert = await this.alertCtrl.create({

      header: 'Stok Masuk',
      message: 'Stok terkini ' + prodName + ' = ' + stock,
      inputs: [
        {
          name: 'addstock',
          type: 'number',
          placeholder: 'Stok masuk'
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
          handler: add => {
            this.addStock(add.addstock, prodName);
            this.addTX(add.addstock, prodName);
            console.log('Confirm Ok' + add.addstock);
          }
        }
      ]
    });
    await alert.present();
  }

  addTX(rmstock, prodName) {

    let txtype = 'masuk';
    return new Promise(resolve => {
      let body = {
        aksi: 'intransaction',
        txproduct: prodName,
        txtotal: rmstock,
        txtype: txtype,
        txname: this.username,

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        console.log("txin", data)


      });
      resolve(true);
    });
  }
  addStock(add, prodName) {
    return new Promise(resolve => {
      const body = {
        aksi: 'updatestockin',
        stock_in: add,
        prodName: prodName,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        console.log("updatestockin", data);
        this.products = [];
        this.ionViewWillEnter();
      });
      resolve(true);

    });
  }


  async removeAlert(id, stock, prodName) {
    const alert = await this.alertCtrl.create({
      header: 'Stok Keluar',
      message: 'Stok terkini ' + prodName + ' = ' + stock,
      inputs: [
        {
          name: 'rmstock',
          type: 'number',

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
          handler: remove => {
            this.removeStock(remove.rmstock, prodName);
            this.removeTX(remove.rmstock, prodName);
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();
  }
  removeTX(rmstock: any, prodName: any) {

    let txtype = 'keluar';
    return new Promise(resolve => {
      let body = {
        aksi: 'outtransaction',
        txproduct: prodName,
        txtotal: rmstock,
        txtype: txtype,
        txname: this.username,

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        console.log("tx", data)


      });
      resolve(true);
    });
  }

  removeStock(remove, prodName) {
    return new Promise(resolve => {
      const body = {
        aksi: 'updatestockout',
        stock_out: remove,
        prodName: prodName,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        console.log("updatestockout", data);
        this.products = [];
        this.ionViewWillEnter();
      });
      resolve(true);

    });
  }

  goTXpage() {
    this.router.navigate(['transaction']);
  }
}
