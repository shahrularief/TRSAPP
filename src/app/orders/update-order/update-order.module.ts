import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicSelectableModule } from 'ionic-selectable';

import { IonicModule } from '@ionic/angular';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';

import { UpdateOrderPage } from './update-order.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateOrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,IonicSelectableModule,
    InternationalPhoneNumberModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UpdateOrderPage]
})
export class UpdateOrderPageModule {}
