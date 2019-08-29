import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountVerifyPage } from './account-verify.page';
import { ImageModalPage } from '../modals/image-modal/image-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AccountVerifyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountVerifyPage, ImageModalPage],
  entryComponents:[ImageModalPage]
})
export class AccountVerifyPageModule {}
