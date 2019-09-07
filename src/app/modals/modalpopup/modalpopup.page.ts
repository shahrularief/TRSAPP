import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modalpopup',
  templateUrl: './modalpopup.page.html',
  styleUrls: ['./modalpopup.page.scss'],
})
export class ModalpopupPage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  public id: string;
  public nama_pelanggan: string;
  public tarikh_order: string;
  public alamat_pelanggan: string;
  public nombor_hp: string;
  public akaun: string;
  public produk: string;
  public penghantaran: string;
  public jumlah_bayaran: string;
  public pengesahan: string;
  public nota_tambahan: string;

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

}
