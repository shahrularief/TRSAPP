import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-prod-product',
  templateUrl: './prod-product.page.html',
  styleUrls: ['./prod-product.page.scss'],
})
export class ProdProductPage implements OnInit {

  constructor(
    private modalController: ModalController

  ) { }
  public counted: any[];
  ngOnInit() {
  }
  async closeModal() {
    await this.modalController.dismiss();
   
  }
}
