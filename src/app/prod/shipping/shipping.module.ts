import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';
import { ShippingPage } from './shipping.page';
import { TooltipModule } from 'ng2-tooltip-directive';

const routes: Routes = [
  {
    path: '',
    component: ShippingPage
  }
];

@NgModule({
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,CalendarModule,
    NgxDatatableModule,
    TooltipModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShippingPage]
})
export class ShippingPageModule {}
