import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

const TOKEN_KEY = 'user-access-token';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.page.html',
  styleUrls: ['./new-order.page.scss'],
})
export class NewOrderPage implements OnInit {

  tarikh_order = '';
  nama_pelanggan = '';
  alamat_pelanggan = '';
  nombor_hp = '';
  akaun = '';
  produk = '';
  jumProduk = '';
  jumlah_bayaran = '';
  nota_tambahan = '';
  pengesahan = '';
  sales = '';
  cameraData: string;
  base64Image: string;


  id: number;
  userData: any;
  sales_username: string;
  sales_team: string;
  users: any;



  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    public toastController: ToastController,
    private storage: Storage,
    private camera: Camera,
    public actionSheetController: ActionSheetController
  ) {

  }
  ionViewWillEnter() {
    this.storage.get(TOKEN_KEY).then((res) => {
      this.users = res;
      this.sales_username = this.users.username;
      this.sales_team = this.users.team;
      console.log(res);
    });
  }


  ngOnInit() {
  }

  async createdProcess() {
    if (this.nama_pelanggan !== '' && this.alamat_pelanggan !== '') {
      let body = {
        aksi: 'add',
        nama_pelanggan: this.nama_pelanggan,
        alamat_pelanggan: this.alamat_pelanggan,
        nombor_hp: this.nombor_hp,
        akaun: this.akaun,
        produk: this.produk,
        jumProduk: this.jumProduk,
        jumlah_bayaran: this.jumlah_bayaran,
        nota_tambahan: this.nota_tambahan,
        pengesahan: this.pengesahan,
        images: this.cameraData,
        resit: this.base64Image,
        sales: this.sales_username,
        sales_team: this.sales_team,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {
        this.router.navigate(['/new-order']);
        console.log('OK');
        console.log(data);

        this.tarikh_order = '';
        this.nama_pelanggan = '';
        this.alamat_pelanggan = '';
        this.nombor_hp = '';
        this.akaun = '';
        this.produk = '';
        this.jumProduk = '';
        this.jumlah_bayaran = '';
        this.nota_tambahan = '';
        this.cameraData = '';

        const toast = await this.toastController.create({
          message: 'Tempahan telah di simpan',
          duration: 2000
        });
        toast.present();
      });
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose one',
      buttons: [
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            this.openGallery();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.cameraData = imageData;
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(this.base64Image);
    }, (err) => {
      // Handle error
      console.log(err + 'error in camera function');
    });
  }
}

