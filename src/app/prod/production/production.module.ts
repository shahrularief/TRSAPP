import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FileInputModule } from 'ng2-file-input';
import { ProductionPage } from './production.page';


const routes: Routes = [
  {
    path: '',
    component: ProductionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    IonicModule,
    NgxDatatableModule,
    Ng2FileInputModule,
 
    RouterModule.forChild(routes)
  ],
  declarations: [ProductionPage],
})
export class ProductionPageModule {}
