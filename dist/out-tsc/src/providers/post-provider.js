import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
var PostProvider = /** @class */ (function () {
    // if you test in real device "http://localhost" change use the your IP
    // server: string = "http://192.199.122.100/IONIC4_CRUD_LOGINREGIS_PHP_MYSQL/server_api/";
    function PostProvider(http) {
        this.http = http;
        this.server = "http://localhost/trsAppV1/server_api/"; // default
    }
    PostProvider.prototype.postData = function (body, file) {
        var type = 'application/json; charset=UTF-8';
        var headers = new Headers({ 'Content-Type': type });
        var options = new RequestOptions({ headers: headers });
        return this.http.post(this.server + file, JSON.stringify(body), options)
            .map(function (res) { return res.json(); });
    };
    PostProvider = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Http])
    ], PostProvider);
    return PostProvider;
}());
export { PostProvider };
//# sourceMappingURL=post-provider.js.map