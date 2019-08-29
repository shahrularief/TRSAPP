import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NewOrderPage } from './new-order.page';
var routes = [
    {
        path: '',
        component: NewOrderPage
    }
];
var NewOrderPageModule = /** @class */ (function () {
    function NewOrderPageModule() {
    }
    NewOrderPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [NewOrderPage]
        })
    ], NewOrderPageModule);
    return NewOrderPageModule;
}());
export { NewOrderPageModule };
//# sourceMappingURL=new-order.module.js.map