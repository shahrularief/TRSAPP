import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AccountVerifyPage } from './account-verify.page';
import { CalendarModule } from 'ion2-calendar';
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
    CalendarModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountVerifyPage],
  

})
export class AccountVerifyPageModule { }
