import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';

const TOKEN_KEY = 'user-access-token';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.page.html',
  styleUrls: ['./new-order.page.scss'],
})
export class NewOrderPage implements OnInit {

  myForm: FormGroup;
  private playerCount: number = 1;

  tarikh_order = '';
  nama_pelanggan = '';
  alamat_pelanggan = '';
  nombor_hp;
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
  company: string;
  users: any;
  products: any[];


  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    public toastController: ToastController,
    private storage: Storage,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder
  ) {
    this.myForm = this.formBuilder.group({
      nama_pelanggan: new FormControl('', Validators.required),
      alamat_pelanggan: new FormControl('', Validators.required),

      nombor_hp: new FormControl('', Validators.required),
      tarikh_order: new FormControl('', Validators.required),
      akaun: new FormControl(''),
      produk: new FormControl(''),
      jumProduk: new FormControl('', Validators.required),
      jumlah_bayaran: new FormControl('', Validators.required),
      nota_tambahan: new FormControl('', Validators.required),
    });
    console.log(this.myForm);
  }
  ionViewWillEnter() {
    this.storage.get(TOKEN_KEY).then((res) => {
      this.users = res;
      this.sales_username = this.users.username;
      this.company = this.users.company;
      console.log(res);
    });

    this.loadProduct();
    this.products = [];
  }


  ngOnInit() {
  }


  async submit() {
    console.log("nama_pelanggan", this.myForm.value.nama_pelanggan);
    console.log("alamat_pelanggan", this.myForm.value.alamat_pelanggan);
    console.log("nombor_hp", this.myForm.value.nombor_hp);
    console.log("akaun", this.myForm.value.akaun);
    console.log("produk", this.myForm.value.produk);
    console.log("jumProduk", this.myForm.value.jumProduk);
    console.log("jumlah_bayaran", this.myForm.value.jumlah_bayaran);
    console.log("nota_tambahan", this.myForm.value.nota_tambahan);



    if (this.myForm.value.nama_pelanggan !== '' && this.myForm.value.alamat_pelanggan !== ''
      && this.myForm.value.nombor_hp !== '' && this.myForm.value.akaun !== '' && this.myForm.value.produk !== ' '
      && this.myForm.value.jumProduk !== ''
      && this.myForm.value.jumlah_bayaran !== '' && this.myForm.value.nota_tambahan !== '') {

      let hp = this.myForm.value.nombor_hp.toString();
      let pro = this.myForm.value.jumProduk.toString();
      let byr = this.myForm.value.jumlah_bayaran.toString();


      let body = {

        aksi: 'add',
        nama_pelanggan: this.myForm.value.nama_pelanggan,
        alamat_pelanggan: this.myForm.value.alamat_pelanggan,
        nombor_hp: hp,
        akaun: this.myForm.value.akaun,
        produk: this.myForm.value.produk,
        jumProduk: pro,
        jumlah_bayaran: byr,
        nota_tambahan: this.myForm.value.nota_tambahan,
        pengesahan: this.pengesahan,
        images: this.cameraData,
        resit: this.base64Image,
        sales: this.sales_username,
        company: this.company,
      };
      const toast = await this.toastController.create({
        message: 'Tempahan telah di simpan',
        duration: 2000
      });
      toast.present();

      this.myForm.reset();
      this.router.navigate(['/new-order']);
      this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {

        console.log('OK');
        console.log(data);




      });
    } else {
      const toast = await this.toastController.create({
        message: 'Isi maklumat pelanggan di atas',
        duration: 3000
      });
      toast.present();
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
      correctOrientation: true,
      allowEdit: true,
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

  //get product array
  loadProduct() {
    return new Promise(resolve => {
      let body = {
        aksi: 'getproduct',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let product of data.result) {
          this.products.push(product);
          console.log(this.products);

        }
        resolve(true);
      });
    });
  }


}

