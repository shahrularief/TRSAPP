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
    loadChildren: './new-order/new-order.module#NewOrderPageModule',
    // canActivate: [AuthGuard],
    // data: {
    //   role: 'TEAM SALES'
    // }
  },

  {
    path: 'rekod-order',
    loadChildren: './rekod-order/rekod-order.module#RekodOrderPageModule',
    // canActivate: [AuthGuard],
    // data: {
    //   role: 'BOD'
    // }

  },


  { path: 'update-order', loadChildren: './update-order/update-order.module#UpdateOrderPageModule' },
  {
    path: 'update-order/:id/:tarikh/:nama/:alamat/:hp/:akaun/:produk/:penghantaran/:bayaran/:nota',
    loadChildren: './update-order/update-order.module#UpdateOrderPageModule'
  },

  { path: 'modalpopup', loadChildren: './modals/modalpopup/modalpopup.module#ModalpopupPageModule' },

  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'registration', loadChildren: './registration/registration.module#RegistrationPageModule' },
  { path: 'account-verify', loadChildren: './account-verify/account-verify.module#AccountVerifyPageModule' },
  { path: 'production', loadChildren: './production/production.module#ProductionPageModule' },
  { path: 'shipping', loadChildren: './shipping/shipping.module#ShippingPageModule' },
  { path: 'image-modal', loadChildren: './modals/image-modal/image-modal.module#ImageModalPageModule' },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
