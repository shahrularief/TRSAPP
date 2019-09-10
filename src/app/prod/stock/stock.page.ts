import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';
import { ModalController } from '@ionic/angular';
import { AddproductPage } from '../../modals/addProduct/addProduct.page';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage implements OnInit {

  products: any[];
  limit = 20; // LIMIT GET PERDATA
  start = 0;
  dinner: any;
  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.products = [];
    this.start = 0;
    this.loadProduct();
 
  }

  onSearchTerm(ev: CustomEvent) {
    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.products = this.products.filter(term => {
        return term.prodName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
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
        limit: this.limit,
        start: this.start,
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
    const modal = await this.modalController.create({
      component: AddproductPage,
    });
    modal.onWillDismiss().then(dataReturned => {
      // trigger when about to close the modal
      this.dinner = dataReturned.data;
      console.log('Receive: ', this.dinner);
    });
    return await modal.present().then(_ => {
      // triggered when opening the modal
    });
  }
}
