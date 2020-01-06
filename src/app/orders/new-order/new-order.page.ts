import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrentstockPage } from '../../modals/currentstock/currentstock.page';
import { ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';

const TOKEN_KEY = 'user-access-token';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.page.html',
  styleUrls: ['./new-order.page.scss'],
})
export class NewOrderPage implements OnInit {
  [x: string]: any;
  public anArray: any = [];
  public bankArray: any = [];
  public imageArray: any = [];
  public resitArray: any = [];
  data;
  myForm: FormGroup;
  produk: FormArray;
  namaakaun;
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
  chip1;
  id: number;
  userData: any;
  sales_username: string;
  nickname: string;
  sales_hp: string;
  company: string;
  users: any;
  products: any[];
  choosenproduct: any[];

  // tslint:disable-next-line: max-line-length
  codImage = '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';

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
    private modalController: ModalController,

  ) {
    this.myForm = this.formBuilder.group({
      nama_pelanggan: ['', Validators.required],
      negeri: ['', Validators.required],
      negara: ['', Validators.required],
      alamat_pelanggan: ['', Validators.required],
      nombor_hp: ['', Validators.required],
      tarikh_order: ['', Validators.required],
      poskod: ['', Validators.required],
      bandar: ['', Validators.required],
      emel: ['', Validators.email],
    });
  }
  ionViewWillEnter() {
    this.auth.authState.subscribe(state => {
      this.users = state;
      this.sales_username = this.users.username;
      this.nickname = this.users.nickname;
      this.company = this.users.company;
      this.sales_hp = this.users.userhp;
      console.log(this.sales_hp)
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

  Addbank(img, rs) {
    this.bankArray.push({ 'bank': '', 'tarikh': '', 'masa': '', 'img': img, 'rs': rs });
    this.imageArray.push(img);
    this.resitArray.push(rs);
    console.log(this.bankArray);
  }


  onDeleteBank(i) {
    console.log(i);
    this.bankArray.splice(i, 1);
    this.imageArray.splice(i, 1);
    this.resitArray.splice(i, 1);
    console.log(this.bankArray);
    console.log(this.imageArray);
    console.log(this.resitArray);
  }

  AddCOD() {
    let image = this.codImage;
    this.sanitizer.bypassSecurityTrustResourceUrl(image);
    this.base64Image = 'data:image/jpeg;base64,' + image;
    this.namaakaun = 'COD';
    this.bankArray.push({ 'bank': 'COD', 'tarikh': '', 'masa': '', 'img': this.base64Image, 'rs': image });
    this.imageArray.push(this.base64Image);
    this.resitArray.push(image);
    console.log(this.bankArray);
    
  }


  async submit() {

    console.log('this.anArray', this.anArray);
    /// this.bankArray.push({ 'nama': '', 'bank': '', 'tarikh': '', 'masa': '', 'img': img , 'rs': rs  });

    let name = [];
    let codename = [];

    let sum = 0;

    let bank = [];
    let tarikhmasa = [];



    for (let i = 0; i < this.bankArray.length; i++) {

      bank.push(this.bankArray[i].bank);
      console.log(bank);

      tarikhmasa.push(this.bankArray[i].tarikh + ' ' + this.bankArray[i].masa);
      console.log(tarikhmasa);

    }

    let code = [];

    for (let i = 0; i < this.anArray.length; i++) {
      console.log(this.anArray[i].value.prodCode); //use i instead of 0

      name.push(this.anArray[i].total + '-' + this.anArray[i].value.prodName);
      codename.push(this.anArray[i].total  + '-' + this.anArray[i].value.prodCode);

      console.log('code', code);
      console.log('name', name);
      console.log('codename', codename);
    }

    for (let i = 0; i < this.anArray.length; i++) {
      sum += +this.anArray[i].total;
      console.log(sum);
    }

    if (
      this.myForm.value.nama_pelanggan !== ''
      && this.myForm.value.alamat_pelanggan !== ''
      && this.myForm.value.poskod !== ''
      && this.myForm.value.negeri !== ''
      && this.myForm.value.negara !== ''
      && this.myForm.value.nombor_hp !== ''
      && this.jumlah_bayaran !== ''
      && this.anArray.length !== 0
      && this.bankArray.length !== 0
    ) {

      let hp = this.myForm.value.nombor_hp.toString();
      let byr = this.jumlah_bayaran.toString();


      let body = {

        aksi: 'add',
        nama_pelanggan: this.myForm.value.nama_pelanggan,
        alamat_pelanggan: this.myForm.value.alamat_pelanggan,
        negeri: this.myForm.value.negeri,
        poskod: this.myForm.value.poskod,
        bandar: this.myForm.value.bandar,
        negara: this.myForm.value.negara,
        nombor_hp: hp.toString(),
        namaakaun: this.namaakaun,
        masaakaun: tarikhmasa.toString(),
        akaun: bank.toString(),
        produk: name.toString(),
        prodCode: codename.toString(),
        jumProduk: sum,
        jumlah_bayaran: byr,
        nota_tambahan: this.nota_tambahan,
        pengesahan: this.pengesahan,
        resit: this.resitArray,
        sales: this.sales_username,
        nickname: this.nickname,
        sales_hp: this.sales_hp,
        company: this.company,
        emel: this.myForm.value.emel,
      };
      const toast = await this.toastController.create({
        message: 'Tempahan telah di simpan',
        duration: 2000
      });
      toast.present();
      this.imageArray = [];
      this.resitArray = [];
      this.bankArray = [];
      this.anArray = [];
      this.namaakaun = '';
      this.jumlah_bayaran = '';
      this.nota_tambahan = '';
      this.myForm.reset();
    
      this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {

        console.log('OK');
        console.log(data);

      });
      this.router.navigate(['/rekod-order']);
    } else {
      if (this.anArray.length == 0) {
        const toast = await this.toastController.create({
          message: 'Tiada Maklumat Produk',
          duration: 3000
        });
        toast.present();
      } else if (this.bankArray.length == 0) {
        const toast = await this.toastController.create({
          message: 'Tiada Maklumat Pembayaran',
          duration: 3000
        });
        toast.present();
      }
      else {
        const toast = await this.toastController.create({
          message: 'Isi maklumat pelanggan di atas',
          duration: 3000
        });
        toast.present();
      }

    }

  }


  openGallery() {
    const options: CameraOptions = {
      quality: 50,
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
      this.sanitizer.bypassSecurityTrustResourceUrl(imageData);
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.Addbank(this.base64Image, imageData);
      console.log(imageData);
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

  async openStock(product) {
    console.log(product)
    const modal = await this.modalController.create({
      component: CurrentstockPage,
      componentProps: {
        product: product,
      }
    });
    return await modal.present().then(_ => {
      // triggered when opening the modal
      console.log('Sending data', modal);
    });
  }

  shopeeChip() {
    console.log('shopee');
    if (this.nota_tambahan === ' ') {
      this.nota_tambahan = 'Shopee'
    }
    else {
      this.nota_tambahan = this.nota_tambahan + ' ' + 'Shopee'
    }
  }

  chatChip() {
    console.log('Chatbot');
    if (this.nota_tambahan === ' ') {
      this.nota_tambahan = 'Chatbot'
    }
    else {
      this.nota_tambahan = this.nota_tambahan + ' ' + 'Chatbot'
    }
  }

  ecomChip() {
    console.log('Ecom');
    if (this.nota_tambahan === ' ') {
      this.nota_tambahan = 'Ecom'
    }
    else {
      this.nota_tambahan = this.nota_tambahan + ' ' + 'Ecom'
    }
  }

  codChip() {
    console.log('COD');
    if (this.nota_tambahan === ' ') {
      this.nota_tambahan = 'COD DHL'
    }
    else {
      this.nota_tambahan = this.nota_tambahan + ' ' + 'COD DHL'
    }
  }


  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
  }
}

