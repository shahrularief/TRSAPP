import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser'; 
const TOKEN_KEY = 'user-access-token';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.page.html',
  styleUrls: ['./new-order.page.scss'],
})
export class NewOrderPage implements OnInit {
  [x: string]: any;
  public anArray: any = [];
  data;
  myForm: FormGroup;
  produk: FormArray;

  tarikh_order = '';
  nama_pelanggan = '';
  alamat_pelanggan = '';
  nombor_hp;
  akaun = '';
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
  choosenproduct: any[];

  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    public toastController: ToastController,
    private storage: Storage,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private sanitizer: DomSanitizer,
  ) {
    this.myForm = this.formBuilder.group({
      nama_pelanggan: ['', Validators.required],
      negeri: ['', Validators.required],
      negara: ['', Validators.required],
      alamat_pelanggan: ['', Validators.required],
      nombor_hp: ['', Validators.required],
      tarikh_order: ['', Validators.required],
      namaakaun: ['', Validators.required],
      akaun: ['', Validators.required],
      poskod: ['', Validators.required],
      bandar: ['', Validators.required],
      emel: ['', Validators.email],
      jumlah_bayaran: ['', Validators.required],
      nota_tambahan: ['', Validators.required]
    });
  }
  ionViewWillEnter() {
    this.auth.authState.subscribe(state => {
      this.users = state;
      this.sales_username = this.users.username;
      this.company = this.users.company;
    });
    this.loadProduct();
    this.products = [];
  }


  ngOnInit() {
  }


  Add() {
    this.anArray.push({ 'value': '', 'total': '' });
    console.log(this.anArray);
  }


  onDelete(i) {
    console.log(i);
    this.anArray.splice(i, 1);
    console.log(this.anArray);
  }
  async submit() {

    console.log('this.anArray', this.anArray);

    let name = [];
    let sum = 0;

    for (let i = 0; i < this.anArray.length; i++) {
      console.log(this.anArray[i].value); //use i instead of 0
      name.push(this.anArray[i].value + '[' + this.anArray[i].total + ']');
      console.log(name);
    }

    for (let i = 0; i < this.anArray.length; i++) {
      sum += this.anArray[i].total;
      console.log(sum);
    }

    if (this.myForm.value.nama_pelanggan !== '' && this.myForm.value.alamat_pelanggan !== ''
      && this.myForm.value.poskod !== ''
      && this.myForm.value.negeri !== ''
      && this.myForm.value.negara !== ''
      && this.myForm.value.nombor_hp !== '' && this.myForm.value.namaakaun !== '' && this.myForm.value.akaun !== ''
      && this.myForm.value.jumlah_bayaran !== '' && this.myForm.value.nota_tambahan !== '') {

      let hp = this.myForm.value.nombor_hp.toString();
      let byr = this.myForm.value.jumlah_bayaran.toString();


      let body = {

        aksi: 'add',
        nama_pelanggan: this.myForm.value.nama_pelanggan,
        alamat_pelanggan: this.myForm.value.alamat_pelanggan,
        negeri: this.myForm.value.negeri,
        poskod: this.myForm.value.poskod,
        bandar: this.myForm.value.bandar,
        negara: this.myForm.value.negara,
        nombor_hp: hp.toString(),
        namaakaun: this.myForm.value.namaakaun,
        akaun: this.myForm.value.akaun,
        produk: name.toString(),
        jumProduk: sum,
        jumlah_bayaran: byr,
        nota_tambahan: this.myForm.value.nota_tambahan,
        pengesahan: this.pengesahan,
        images: this.cameraData,
        resit: this.base64Image,
        sales: this.sales_username,
        company: this.company,
        emel: this.myForm.value.emel,
      };
      const toast = await this.toastController.create({
        message: 'Tempahan telah di simpan',
        duration: 2000
      });
      toast.present();

      this.anArray = [];
      this.myForm.reset();
      this.router.navigate(['/rekod-tempahan']);
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
      this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Image);
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


        }
        resolve(true);
        console.log(this.products);
      });
    });
  }


}

