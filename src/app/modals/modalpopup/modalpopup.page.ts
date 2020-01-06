import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-modalpopup',
  templateUrl: './modalpopup.page.html',
  styleUrls: ['./modalpopup.page.scss'],
})
export class ModalpopupPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    
  ) { }

  public order_id: string;
  public nama_pelanggan: string;
  public tarikh_order: string;
  public alamat_pelanggan: string;
  public akaun: string;
  public poskod: string;
  public bandar: string;

  public negeri: string;
  public negara: string;
  public emel: string;
  public masaakaun: string;
  public namaakaun: string;
  public penghantaran: string;

  public nombor_hp: string;
  public produk: string;
  public jumProduk: string;
  public jumlah_bayaran: string;
  public pengesahan: string;
  public nota_tambahan: string;
  public tracking: string;
 public base64image: string;

 
  ngOnInit() {
    
    console.log(this.masaakaun);
  }

  async closeModal() {
    await this.modalController.dismiss();
    this.base64image = " ";
  }

  sanitize(img){
    
    let im = 'data:image/jpeg;base64,' + img;
    return this.sanitizer.bypassSecurityTrustUrl(im);
  }
  
}
