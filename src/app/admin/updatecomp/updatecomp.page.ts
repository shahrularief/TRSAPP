import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-updatecomp',
  templateUrl: './updatecomp.page.html',
  styleUrls: ['./updatecomp.page.scss'],
})
export class UpdatecompPage implements OnInit {
  compName;
  compReg;
  compAddr;
  compCity;
  compPostcode;
  compState;
  compHP;
  compMonthS;
  compMonthE;
  id: number;

  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    public toastController: ToastController,

    ) { }

  ngOnInit() {
    this.actRoute.params.subscribe((data: any) => {
      this.id = data.id;
      this.compName = data.nama;
      this.compReg = data.reg;
      this.compAddr = data.addr;
      this.compCity = data.city;
      this.compPostcode = data.pc;
      this.compHP = data.hp;
      this.compState = data.stat;
      
     
      console.log(data);
    });
  }

updatedProcess() {
    console.log(this.compMonthS);
    return new Promise(async resolve => {
        let body = {
          aksi : 'updatecompany',
          compID : this.id,
          compName : this.compName,
          compReg : this.compReg,
          compAddr : this.compAddr,
          compCity : this.compCity,
          compPostcode : this.compPostcode,
          compHP : this.compHP,
          compState: this.compState,
          compMonthS : this.compMonthS,
          compMonthE : this.compMonthE,

        };
        const toast = await this.toastController.create({
          message: 'Telah dikemaskini',
          duration: 2000
        });
        
        this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
          this.router.navigate(['/viewcompany']);
          console.log('OK');
          toast.present();
        });
      });

  }

}
