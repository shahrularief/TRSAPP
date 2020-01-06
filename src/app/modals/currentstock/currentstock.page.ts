import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-currentstock',
  templateUrl: './currentstock.page.html',
  styleUrls: ['./currentstock.page.scss'],
})
export class CurrentstockPage implements OnInit {

  constructor(
    private modalController: ModalController

  ) { }

  public product: any[];
  ngOnInit() {
  }
  async closeModal() {
    await this.modalController.dismiss();
   
  }
}
