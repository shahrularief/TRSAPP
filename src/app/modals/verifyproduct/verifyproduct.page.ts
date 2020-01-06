import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-verifyproduct',
  templateUrl: './verifyproduct.page.html',
  styleUrls: ['./verifyproduct.page.scss'],
})
export class VerifyproductPage implements OnInit {
  public anArray = [];
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
