import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CalendarModule } from 'ion2-calendar';
import { TransactionPage } from './transaction.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransactionPage]
})
export class TransactionPageModule {}
