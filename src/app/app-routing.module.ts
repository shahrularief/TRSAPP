import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'account-verify',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
  },

  {
    path: 'new-order',
    loadChildren: './orders/new-order/new-order.module#NewOrderPageModule',
    // canActivate: [AuthGuard],
    // data: {
    //   role: 'TEAM SALES'
    // }
  },

  {
    path: 'rekod-order',
    loadChildren: './orders/rekod-order/rekod-order.module#RekodOrderPageModule',
    // canActivate: [AuthGuard],
    // data: {
    //   role: 'BOD'
    // }

  },


  { path: 'update-order', loadChildren: './orders/update-order/update-order.module#UpdateOrderPageModule' },
  {
    path: 'update-order/:id/:tarikh/:nama/:alamat/:hp/:akaun/:produk/:jumProduk/:bayaran/:nota',
    loadChildren: './orders/update-order/update-order.module#UpdateOrderPageModule'
  },

  { path: 'modalpopup', loadChildren: './modals/modalpopup/modalpopup.module#ModalpopupPageModule' },

  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'registration', loadChildren: './admin/registration/registration.module#RegistrationPageModule' },
  { path: 'account-verify', loadChildren: './accounting/account-verify/account-verify.module#AccountVerifyPageModule' },
  { path: 'production', loadChildren: './prod/production/production.module#ProductionPageModule' },
  { path: 'shipping', loadChildren: './prod/shipping/shipping.module#ShippingPageModule' },
  { path: 'stock', loadChildren: './prod/stock/stock.module#StockPageModule' },
  { path: 'company', loadChildren: './admin/company/company.module#CompanyPageModule' },
  { path: 'viewcompany', loadChildren: './admin/viewcompany/viewcompany.module#ViewcompanyPageModule' },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
