import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { PostProvider } from 'src/providers/post-provider';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {
  userCurrent: any[];
  username;
  userID;
  password;
  role;
  fullname;
  userhp;
  userEmail;
  company;
  nickname;
  cameraData: string;
  base64Image: string;
  showUp = false;
  Image: string;
  avatar;
  constructor(
    private auth: AuthService,
    private router: Router,
    private camera: Camera,
    private sanitizer: DomSanitizer,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    private postPrvdr: PostProvider,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkUser()
    this.showUp = false;
  }
  checkUser() {
    this.auth.authState.subscribe(user => {
      this.userCurrent = user;
      console.log(this.userCurrent);
      this.userID = user.userID;
      this.username = user.username;
      this.password = user.password;
      this.role = user.role;
      this.fullname = user.fullname;
      this.userhp = user.userhp;
      this.userEmail = user.userEmail;
      this.company = user.company;
      this.nickname = user.nickname;

      let imageData = user.avatar;
      this.sanitizer.bypassSecurityTrustResourceUrl(imageData);
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    });
  }

 async updateAvatar(){
    let body = {

      aksi: 'updateAvatar',
      avatar: this.Image,
      userID:  this.userID,
    };
    const toast = await this.toastController.create({
      message: 'Gambar telah dikemaskini',
      duration: 2000
    });
    toast.present();

    this.postPrvdr.postData(body, 'process-api.php').subscribe(async data => {

      console.log('OK');
      console.log(data);
      this.auth.signOut();

    });

  } 
  


  editProfile(userID, username, password, role, fullname, userhp, userEmail, company, nickname) {
    console.log(userID, username, password, role, fullname, userhp, userEmail, company, nickname);
    let details = {
      userID: userID,
      username: username,
      password: password,
      role: role,
      fullname: fullname,
      userhp: userhp,
      userEmail: userEmail,
      company: company,
      nickname: nickname,
    }
    let navigationExtras: NavigationExtras = {
      state: {
        user: details
      }
    };
    console.log("ne", navigationExtras)
    this.router.navigate(['updateemployee'], navigationExtras);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile',
      buttons: [{
        text: 'Cancel',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.openCamera();
          console.log('camera clicked');
        }
      }, {
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          this.openGallery();
          console.log('Gallery clicked');
        }
      }
      ]
    });
    await actionSheet.present();
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
      this.Image = imageData;
      this.showUp = true;
      console.log(imageData);
      console.log(this.base64Image);
    }, (err) => {
      // Handle error
      console.log(err + 'error in camera function');
    });
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 50,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.CAMERA,
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
      this.showUp = true;
      this.Image = imageData;

      console.log(imageData);
      console.log(this.base64Image);
    }, (err) => {
      // Handle error
      console.log(err + 'error in camera function');
    });
  }

}
