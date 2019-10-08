import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {
  tarikh_order: string = '';
  nama_pelanggan: string = '';
  alamat_pelanggan: string = '';
  nombor_hp: string = '';
  akaun: string = '';
  produk: string = '';
  jumProduk: string = '';
  jumlah_bayaran: string = '';
  nota_tambahan: string = '';
  id: number;
  tracking;
  sales;

  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    private printer: Printer,
  ) { }

  ngOnInit() {
    this.actRoute.params.subscribe((data: any) => {
      this.id = data.id;
      this.nama_pelanggan = data.nama;
      this.tarikh_order = data.tarikh;
      this.alamat_pelanggan = data.alamat;
      this.nombor_hp = data.hp;
      this.akaun = data.akaun;
      this.produk = data.produk;
      this.jumProduk = data.jumProduk;
      this.jumlah_bayaran = data.bayaran;
      this.nota_tambahan = data.nota;
      this.tracking = data.track;
      this.sales = data.sales;
      this.tracking = data.track;
      console.log(data);
      // this.print();
     
    });
 
  }

  ionViewDidEnter(){
    window.print();
  }
  print() {
    this.printer.isAvailable().then(this.onSuccessLoad, this.onErrorLoad);

  }

  onSuccessLoad() {
    let options: PrintOptions = {
      name: 'MyDocument',
      duplex: true,
      landscape: true,
    };

    this.printer.print('../receipt/receipt.page.html', options).then();
  }
  onErrorPrint() {
    console.log("error print");
  }
  onSuccessPrint() {
    console.log("printing");
  }

  onErrorLoad() {
    alert('Error : printing is unavailable on your device ');
  }
}