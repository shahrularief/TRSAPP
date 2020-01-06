import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { CurrentstockPage } from '../../modals/currentstock/currentstock.page';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.page.html',
  styleUrls: ['./update-order.page.scss'],
})
export class UpdateOrderPage implements OnInit {
  myForm: FormGroup;

  tarikh_order: string = '';
  nama_pelanggan: string = '';
  alamat_pelanggan: string = '';
  nombor_hp: string = '';
  akaun: string = '';
  masaakaun: string = '';
  namaakaun: string = '';
  produk: string = '';
  jumProduk: string = '';
  jumlah_bayaran: string = '';
  nota_tambahan: string = '';
  order_id: number;
  public anArray: any = [];
  public imageArray: any = [];
  public bankArray: any = [];
  public resitArray: any = [];
  products: any[];
  cameraData: string;
  base64Image: string;
  userRole;

  data: any;
  constructor(
    private postPrvdr: PostProvider,
    private router: Router,
    private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    public toastController: ToastController,
    public auth: AuthService,
    private modalController: ModalController,

  ) {

    this.actRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        console.log("dataaaa", this.data);
        this.myForm.patchValue(this.data);
        this.order_id = this.data.order_id;
        this.resitArray = this.data.resit;
        this.nota_tambahan = this.data.nota;
        this.jumlah_bayaran = this.data.bayaran;
        this.akaun = this.data.akaun;
        this.namaakaun = this.data.namaakaun;
        this.masaakaun = this.data.masaakaun;

        let prod = this.data.produk;
        let code = this.data.prodCode;
        console.log(this.masaakaun);
        console.log("produk?!",prod,code);


        let anoArr = [];
        let splitarikh = [];
        let splitlagi = [];

        //tarikh
        splitarikh = this.masaakaun.split(",");
        console.log("split tar", splitarikh)

        for (let i = 0; i < splitarikh.length; i++) {
          splitlagi = splitarikh[i].split(" ");
          anoArr.push({ tarikh: splitlagi[0], masa: splitlagi[1] });
        }
        console.log("splitlagi", splitlagi)
        console.log("anoArr", anoArr)

        //nama bank
        let akaun = [];
        let splitakaun = this.akaun.split(",");
        console.log("splitakaun", splitakaun)

        for (let i = 0; i < splitakaun.length; i++) {

          akaun.push(splitakaun[i]);
        }
        console.log("splitakaun", splitakaun)
        console.log("akaun", akaun)





        for (let i = 0; i < this.resitArray.length; i++) {
          let base64 = 'data:image/jpeg;base64,' + this.resitArray[i];
          this.imageArray.push(base64);
          console.log("INIMAGE", this.imageArray);

        }


        for (let x = 0; x < akaun.length; x++) {
          this.bankArray.push({
            'bank': akaun[x], 'tarikh': anoArr[x].tarikh,
            'masa': anoArr[x].masa, 'img': this.imageArray[x], 'rs': this.resitArray[x]
          });
        }
        console.log("Yay?!", this.bankArray);





/// produk///////

        let parts = prod.split(",");
        console.log(parts);
        if (parts.length > 1) {
          console.log("more");

          for (let i = 0; i < parts.length; i++) {
            let name = parts[i].split("-", 2);
            this.anArray.push({ value:{prodName: name[1]}, total:name[0] });
            console.log("2", name);
            console.log(this.anArray);
          }

        } else {
          console.log("1");

          let name = parts[0].split("-", 2);
          this.anArray.push({ value:{ prodName: name[1]},total:name[0] });
          console.log("2", name);
          console.log(this.anArray);
        }

      }

    });

    this.myForm = this.formBuilder.group({
      nama: [null],
      negeri: [null],
      negara: [null],
      alamat: [null],
      hp: [null],
      tarikh: [null],
      namaakaun: [null],
      akaun: [null],
      poskod: [null],
      bandar: [null],
      emel: [null],
      sah: [null]
    });


  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.products = [];
    this.loadProduct();
    this.getRole();
  }
  getRole() {
    let cRole;
    this.auth.authState.subscribe(user => {
      cRole = user.role;
      console.log("cRole",cRole)
    })
   

    if (cRole == "SALES"){
      this.userRole = "true";
     
    } else {
      this.userRole = "false";
     
    }
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



  async submit() {

    console.log('this.anArray', this.anArray);


    let bank = [];
    let tarikhmasa = [];
    let codename = [];



    for (let i = 0; i < this.bankArray.length; i++) {

      bank.push(this.bankArray[i].bank);
      console.log(bank);

      tarikhmasa.push(this.bankArray[i].tarikh + ' ' + this.bankArray[i].masa);
      console.log(tarikhmasa);

    }

    let name = [];
    let sum = 0;

    let code = [];

    for (let i = 0; i < this.anArray.length; i++) {
      console.log(this.anArray[i].value.prodCode); //use i instead of 0

      name.push(this.anArray[i].value.prodName + '-' + this.anArray[i].total);
      codename.push(this.anArray[i].value.prodCode + '-' + this.anArray[i].total);
     
      console.log('code', code);
      console.log('name', name);
      console.log('codename', codename);
    }
    for (let i = 0; i < this.anArray.length; i++) {
      sum += +this.anArray[i].total;
      console.log(sum);
    }

    let hp = this.myForm.value.hp;
    let byr = this.jumlah_bayaran;


    let body = {

      aksi: 'update',
      order_id: this.order_id,
      nama_pelanggan: this.myForm.value.nama,
      alamat_pelanggan: this.myForm.value.alamat,
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
      pengesahan: this.myForm.value.sah,
      nota_tambahan: this.nota_tambahan,
      resit: this.resitArray,
      emel: this.myForm.value.emel,
    };
    const toast = await this.toastController.create({
      message: 'Tempahan telah dikemaskini',
      duration: 2000
    });
    toast.present();
    this.imageArray = [];
    this.resitArray = [];
    this.anArray = [];
    this.namaakaun = '';
    this.jumlah_bayaran = '';
    this.nota_tambahan = '';
    this.myForm.reset();
    this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {
     
      console.log('OK');
      console.log(data);

    });
    this.router.navigate(['/rekod-order'])

  }

  sanitizeImg(img) {
    let sanImg = "data:image/png;base64," + img;
    return this.sanitizer.bypassSecurityTrustUrl(sanImg);
  }
  onDeleteImage(i) {
    console.log(i);
    this.imageArray.splice(i, 1);
    this.resitArray.splice(i, 1);
    console.log(this.imageArray);
    console.log(this.resitArray);
  }

  
  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
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


}
