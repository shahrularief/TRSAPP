import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  prodName: string;
  prodCode: string;
  prodPrice: string;
  prodStock: string;

  constructor(private modalController: ModalController) { }
  public dinner = {
    prodName: this.prodName,
    prodCode: this.prodCode,
    prodPrice: this.prodPrice,
    prodStock: this.prodStock,
  };

  ngOnInit() {
  }
  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
