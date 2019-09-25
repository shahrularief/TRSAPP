import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';

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
 
  limit: number = 13; // LIMIT GET PERDATA
  start: number = 0;

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

      this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {
        this.router.navigate(['/company']);
        console.log('OK');
        console.log(data);

        this.compname = '';
        this.compreg = '';
        this.compaddr = '';
        this.compcity = '';
        this.comppostcode = '';
        this.compstate = '';
        this.comphp = '';
     
        const toast = await this.toastController.create({
          message: 'Tempahan telah di simpan',
          duration: 2000
        });
        toast.present();
      });
    }
  }
}
