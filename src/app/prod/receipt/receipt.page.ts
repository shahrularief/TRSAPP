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
  public anArray: any[];
  order_id;
  nama;
  emel;
  tarikh;
  alamat;
  poskod;
  bandar;
  negeri;
  hp;
  namaakaun;
  negara;
  produk;
  akaun;
  jumProduk;
  penghantaran;
  bayaran;
  sales;
  track;
  data: any;
  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    private printer: Printer,
  ) {
    this.actRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        console.log("dataaaa", this.data);
        
        this.order_id = this.data.order_id;
        this.nama = this.data.nama;
        this.emel = this.data.emel;
        this.tarikh = this.data.tarikh;
        this.alamat = this.data.alamat;
        this.poskod = this.data.poskod;
        this.bandar = this.data.bandar;
        this.negeri = this.data.negeri;
        this.hp = this.data.hp;
        this.negara = this.data.negara;
        this.namaakaun = this.data.namaakaun;
        this.akaun = this.data.akaun;
        this.jumProduk = this.data.jumProduk;
        this.penghantaran = this.data.penghantaran;
        this.bayaran = this.data.bayaran;
        this.sales = this.data.sales;
        this.track = this.data.track;

        let prod_bil = this.data.produk;


       
        let parts = prod_bil.split(",");
        console.log(parts);
        if (parts.length > 1) {
          console.log("more");

          for (let i = 0; i < parts.length; i++) {
            let secondparts = parts[i].split("-", 2);
            this.anArray.push({ value: secondparts[0], total: secondparts[1] });
            console.log("2", secondparts);
            console.log( this.anArray);
          }

        } else {
          console.log("1");

          let secondparts = parts[0].split("-", 2);
          this.anArray.push({ value: secondparts[0], total: secondparts[1] });
          console.log("2", secondparts);
          console.log( this.anArray);
         }

        }

    });

   }

  ngOnInit() {

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