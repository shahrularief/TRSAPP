import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpModule } from '@angular/http';
import { PostProvider } from '../providers/post-provider';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { ImageModalPageModule } from './modals/image-modal/image-modal.module';
import { ModalpopupPageModule } from './modals/modalpopup/modalpopup.module';
import { VerifyproductPageModule } from './modals/verifyproduct/verifyproduct.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProdProductPageModule } from './modals/prod-product/prod-product.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpModule,
    JwtModule.forRoot({}),
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ImageModalPageModule,
    ModalpopupPageModule,
    VerifyproductPageModule,
    ProdProductPageModule,
    NgxDatatableModule,
    NgxSpinnerModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    PostProvider,
    SplashScreen,
    FileTransfer,
    FileTransferObject,
    File,
    FilePath,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
