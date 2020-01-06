import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { resolve } from 'dns';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  compname = '';
  compreg = '';
  compaddr = '';
  compcity = '';
  comppostcode = '';
  compstate = '';
  comphp = '';

  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
  }



  async createCompany() {
    if (this.compname !== '' && this.compreg !== '') {
      return new Promise(async resolve => {
      let body = {
        aksi: 'addcompany',
        compname: this.compname,
        compreg: this.compreg,
        compaddr: this.compaddr,
        compcity: this.compcity,
        comppostcode: this.comppostcode.toString(),
        compstate: this.compstate,
        comphp: this.comphp.toString(),
      };
      const toast = await this.toastController.create({
        message: 'Maklumat telah di simpan',
        duration: 2000
      });
      this.postPrvdr.postData(body, 'process-api.php').subscribe( data => {

        console.log('OK');
        
        this.compname = '';
        this.compreg = '';
        this.compaddr = '';
        this.compcity = '';
        this.comppostcode = '';
        this.compstate = '';
        this.comphp = '';

        console.log(data);
        
      });
      resolve(true);
      this.router.navigate(['/viewcompany']);
      toast.present();
      
    });
    }
  }


  updatedProcess() {
    if (this.compname !== '' && this.compreg !== '') {
    return new Promise(async resolve => {
        let body = {
          aksi: 'addcompany',
          compname: this.compname,
          compreg: this.compreg,
          compaddr: this.compaddr,
          compcity: this.compcity,
          comppostcode: this.comppostcode,
          compstate: this.compstate,
          comphp: this.comphp,

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



}
