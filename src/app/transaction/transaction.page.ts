import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult
} from 'ion2-calendar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import * as papa from 'papaparse';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PostProvider } from 'src/providers/post-provider';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  tranx: any = [];
  tableStyle = 'bootstrap fullscreen';
  headerRow;
  constructor(

    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private modalController: ModalController,
    public datatable: NgxDatatableModule,
    private auth: AuthService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tranx = [];
    this.loadTransaction();
  }

  loadTransaction() {

    return new Promise(resolve => {
      const body = {
        aksi: 'gettransactions',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {

        for (const x of data.result) {
          this.tranx.push(x);

        }
        console.log('tranx:' + this.tranx);
        resolve(true);
        this.tranx = this.tranx.map(row => ({
          txid: row['txid'],
          txproduct: row['txproduct'],
          txtotal: row['txtotal'],
          txtype: row['txtype'],
          txname: row['txname'],
          created_at: row['created_at'],
        }));

      });
    });
  }

  clearArrayCust() {
    setTimeout(() => {
      this.tranx = [];
      this.ionViewWillEnter();

    }, 500);
  }

  doRefresh(event) {
    setTimeout(() => {

      this.tranx = [];
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log(val);
    if (val && val.trim() !== '') {
      const temp = this.tranx.filter(d => {
        return d.txproduct.toLowerCase().indexOf(val) !== -1 || !val ||  d.txtype.toLowerCase().indexOf(val) !== -1
      });
      this.tranx = temp;
    } else {
      this.tranx = [];
      this.loadTransaction();
    }
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'Pilih Tarikh',
      canBackwardsSelected: true,
    };

    const myCalendar = await this.modalController.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    let dateString: any = date.string;
    console.log(dateString);
    this.onSearchDate(dateString);

  }

  onSearchDate(from) {
    const val = from;
    if (val && val.trim() !== '') {
      this.tranx = this.tranx.filter(term => {
        return term.created_at.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;

      });

    } else {
      this.tranx = [];
      this.loadTransaction();
    }
  }



  downloadCSV() {
    let date = new Date();
    let day = date.getDay() + 1;
    let month = date.getMonth() + 1;

    console.log(day + '/' + month);
    let tranxCSV = this.tranx.map(row => ({
      ID: row['txid'],
      Produk: row['txproduct'],
      Jumlah: row['txtotal'],
      Jenis_Transaksi: row['txtype'],
      Oleh: row['txname'],
      Tarikh: row['created_at'],
    }));


    console.log(tranxCSV);
    let csv = papa.unparse({
      fields: this.headerRow,
      data: tranxCSV,
    });

    // Dummy implementation for Desktop download purpose
    let blob = new Blob([csv]);
    let a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = day + '' + month + '_' + "transaksi" + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getIcon(type) {
    console.log("type", type)
    let icon;
    if (type == 'masuk') {
      return icon = 'arrow-round-up'
    } else {
      return icon = 'arrow-round-down'
    }
  }

  getColor(type) {
    console.log("type", type)
    let col;
    if (type == 'masuk') {
      return col = 'success'
    } else {
      return col = 'danger'
    }
  }
}
