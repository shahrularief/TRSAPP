import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SalesbypersonPage } from './salesbyperson.page';

const routes: Routes = [
  {
    path: '',
    component: SalesbypersonPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SalesbypersonPage]
})
export class SalesbypersonPageModule {}
