import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
  },

  {
    path: 'rekod-order',
    loadChildren: './orders/rekod-order/rekod-order.module#RekodOrderPageModule',
  },


  { path: 'update-order', loadChildren: './orders/update-order/update-order.module#UpdateOrderPageModule' },
  {
    path: 'update-order/:id/:tarikh/:nama/:emel/:poskod/:bandar/:negeri/:negara/:hp/:namaakaun/:akaun/:produk/:jumProduk/:bayaran/:nota/:sah/:alamat',
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
  { path: 'salesteam', loadChildren: './admin/salesteam/salesteam.module#SalesteamPageModule' },
  { path: 'salesmember', loadChildren: './admin/salesmember/salesmember.module#SalesmemberPageModule' },
  { path: 'verifyproduct', loadChildren: './modals/verifyproduct/verifyproduct.module#VerifyproductPageModule' },
  { path: 'prod-product', loadChildren: './modals/prod-product/prod-product.module#ProdProductPageModule' },
  { path: 'employee', loadChildren: './admin/employee/employee.module#EmployeePageModule' },
  { path: 'updatecomp', loadChildren: './admin/updatecomp/updatecomp.module#UpdatecompPageModule' },

  { path: 'updatecomp/:id/:nama/:reg/:addr/:city/:pc/:stat/:hp/:ms/:me',
  loadChildren: './admin/updatecomp/updatecomp.module#UpdatecompPageModule' },
  { path: 'receipt', loadChildren: './prod/receipt/receipt.module#ReceiptPageModule' },
  {
    path: 'receipt/:id/:tarikh/:nama/:alamat/:hp/:akaun/:produk/:jumProduk/:bayaran/:nota/:sales/:track',
    loadChildren: './prod/receipt/receipt.module#ReceiptPageModule'
  },
  { path: 'updateemployee', loadChildren: './admin/updateemployee/updateemployee.module#UpdateemployeePageModule' },
  { path: 'updateemployee/:user/:full/:nick/:hp/:emel/:role/:comp/:id/:pass',
  loadChildren: './admin/updateemployee/updateemployee.module#UpdateemployeePageModule' },
  { path: 'account-report', loadChildren: './accounting/account-report/account-report.module#AccountReportPageModule' },
  { path: 'transaction', loadChildren: './transaction/transaction.module#TransactionPageModule' },
  { path: 'view-profile', loadChildren: './view-profile/view-profile.module#ViewProfilePageModule' },
  { path: 'request', loadChildren: './modals/request/request.module#RequestPageModule' },
  { path: 'currentstock', loadChildren: './modals/currentstock/currentstock.module#CurrentstockPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
