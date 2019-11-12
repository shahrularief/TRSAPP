import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IonicModule } from '@ionic/angular';
import { TooltipModule } from 'ng2-tooltip-directive';

import { RekodOrderPage } from './rekod-order.page';

const routes: Routes = [
  {
    path: '',
    component: RekodOrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    TooltipModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RekodOrderPage]
})
export class RekodOrderPageModule {}
