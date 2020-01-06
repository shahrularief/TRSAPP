import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {


  constructor(
    private modalController: ModalController,
    private sanitizer: DomSanitizer,

  ) { }
 
  public base64image: string;

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  sanitize(img){
    
    let im = 'data:image/jpeg;base64,' + img;
    return this.sanitizer.bypassSecurityTrustUrl(im);
  }
}
