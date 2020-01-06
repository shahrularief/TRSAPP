import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FileInputModule } from 'ng2-file-input';
import { ProductionPage } from './production.page';
import { TooltipModule } from 'ng2-tooltip-directive';

import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: ProductionPage
  }
];

@NgModule({
  providers: [DatePipe],
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    IonicModule,
    TooltipModule,
    NgxDatatableModule,
    Ng2FileInputModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductionPage],
})
export class ProductionPageModule {}
