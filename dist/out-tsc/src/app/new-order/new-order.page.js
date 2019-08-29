import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { PostProvider } from '../../providers/post-provider';
import { Router, ActivatedRoute } from '@angular/router';
var NewOrderPage = /** @class */ (function () {
    function NewOrderPage(postPrdv, router, actRoute) {
        this.postPrdv = postPrdv;
        this.router = router;
        this.actRoute = actRoute;
        this.tarikhOrder = "";
        this.namaPelanggan = "";
        this.alamatPelanggan = "";
        this.nomborHp = "";
        this._emel = "";
        this._product = "";
        this._penghantaran = "";
        this.jumlahBayaran = "";
        this.notaTambahan = "";
    }
    NewOrderPage.prototype.ngOnInit = function () {
    };
    NewOrderPage.prototype.createdProcess = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var body = {
                aksi: 'add',
                tarikhOrder: _this.tarikhOrder,
                namaPelanggan: _this.namaPelanggan,
                alamatPelanggan: _this.alamatPelanggan,
                nomborHp: _this.nomborHp,
                _emel: _this._emel,
                _product: _this._product,
                _penghantaran: _this._penghantaran,
                jumlahBayaran: _this.jumlahBayaran,
                notaTambahan: _this.notaTambahan,
            };
            _this.postPrdv.postData(body, 'process-api.php').subscribe(function (data) {
                _this.router.navigate(['/customer']);
                console.log('OK');
            });
        });
    };
    NewOrderPage = tslib_1.__decorate([
        Component({
            selector: 'app-new-order',
            templateUrl: './new-order.page.html',
            styleUrls: ['./new-order.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [PostProvider,
            Router,
            ActivatedRoute])
    ], NewOrderPage);
    return NewOrderPage;
}());
export { NewOrderPage };
//# sourceMappingURL=new-order.page.js.map