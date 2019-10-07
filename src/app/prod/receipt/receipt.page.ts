import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
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
      this.jumlah_bayaran = data.bayaran ;
      this.nota_tambahan = data.nota;
      this.tracking = data.track;
      console.log(data);
    });
  }

}
