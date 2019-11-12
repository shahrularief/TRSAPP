import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';

@Component({
  selector: 'app-account-report',
  templateUrl: './account-report.page.html',
  styleUrls: ['./account-report.page.scss'],
})
export class AccountReportPage implements OnInit {
  customers: any[];
  loadedcustomers: any[];
  tableStyle = 'material fullscreen';

  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.customers = [];
    this.loadedcustomers = [];
    this.loadCustomer();

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    if (val && val.trim() !== '') {
      const temp = this.customers.filter(function (d) {
        return d.company.toLowerCase().indexOf(val) !== -1 || !val || d.nama_pelanggan.toLowerCase().indexOf(val) !== -1
          || d.sales.toLowerCase().indexOf(val) !== -1 || d.verified_by.toLowerCase().indexOf(val) !== -1;
      });
      this.customers = temp;
    } else {
      this.customers = [];
      this.loadCustomer();
    }
  }
  loadCustomer() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getdataverified',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const customer of data.result) {
          this.customers.push(customer);

        }
        console.log('customers:' + this.customers);
        resolve(true);
        this.customers = this.customers.map(row => ({
          order_id: row['order_id'],
          tarikh_order: row['tarikh_order'],
          tarikh_verify: row['tarikh_verify'],
          verified_by: row['verified_by'],
          nama_pelanggan: row['nama_pelanggan'],
          alamat_pelanggan: row['alamat_pelanggan'],
          poskod: row['poskod'],
          bandar: row['bandar'],
          negeri: row['negeri'],
          negara: row['negara'],
          nombor_hp: row['nombor_hp'],
          namaakaun: row['namaakaun'],
          akaun: row['akaun'],
          produk: row['produk'],
          penghantaran: row['penghantaran'],
          jumlah_bayaran: row['jumlah_bayaran'],
          jumProduk: row['jumProduk'],
          nota_tambahan: row['nota_tambahan'],
          sales: row['sales'],
          company: row['company'],
          fail_lampiran: row['fail_lampiran'],
          resit: row['resit'],
          pengesahan: row['pengesahan']
        }));
      });
    });
  }

}
