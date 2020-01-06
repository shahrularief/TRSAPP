import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  message;
  constructor(
    private modalController: ModalController,
  ) { }

  public order_id: String;
  public data = {
    order_id: this.order_id,
    message: this.message,
  }
  ngOnInit() {
    console.log(this.order_id);
  }

  async closeModal() {
    await this.modalController.dismiss(this.data);
  }


}
