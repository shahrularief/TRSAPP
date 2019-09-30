import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';
import { ShippingPage } from './shipping.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,CalendarModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShippingPage]
})
export class ShippingPageModule {}
