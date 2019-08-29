import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RekodOrderPage } from './rekod-order.page';
import { ModalpopupPage} from '../modals/modalpopup/modalpopup.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [RekodOrderPage, ModalpopupPage],
  entryComponents: [ModalpopupPage]
})
export class RekodOrderPageModule {}
