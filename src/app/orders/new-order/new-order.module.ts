import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewOrderPage } from './new-order.page';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { TooltipModule } from 'ng2-tooltip-directive';
import { IonicSelectableModule } from 'ionic-selectable';

const routes: Routes = [
  {
    path: '',
    component: NewOrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    InternationalPhoneNumberModule,
    TooltipModule, IonicSelectableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewOrderPage]
})
export class NewOrderPageModule {}
