import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TooltipModule } from 'ng2-tooltip-directive';
import { AutosizeModule } from 'ngx-autosize';

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
  providers: [DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    AutosizeModule,
    IonicModule,
    CalendarModule,
    NgxDatatableModule,
    TooltipModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AccountVerifyPage],
  

})
export class AccountVerifyPageModule { }
