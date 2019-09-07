import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.page.html',
  styleUrls: ['./update-order.page.scss'],
})
export class UpdateOrderPage implements OnInit {

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

      console.log(data);
    });
  }

  updatedProcess() {
    return new Promise(resolve => {
        let body = {
          aksi : 'update',
          order_id : this.id,
          nama_pelanggan : this.nama_pelanggan,
          tarikh_order : this.tarikh_order,
          alamat_pelanggan : this.alamat_pelanggan,
          nombor_hp : this.nombor_hp,
          akaun : this.akaun,
          produk : this.produk,
          jumProduk : this.jumProduk,
          jumlah_bayaran : this.jumlah_bayaran,
          nota_tambahan : this.nota_tambahan,
        };

        this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
          this.router.navigate(['/rekod-order']);
          console.log('OK');
        });
      });

  }

}
