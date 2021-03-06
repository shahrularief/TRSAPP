import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TooltipModule } from 'ng2-tooltip-directive';


import { IonicModule } from '@ionic/angular';

import { StockPage } from './stock.page';

const routes: Routes = [
  {
    path: '',
    component: StockPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TooltipModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StockPage]
})
export class StockPageModule {}
