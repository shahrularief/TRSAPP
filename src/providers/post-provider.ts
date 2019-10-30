import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostProvider {
    // server: string = 'http://192.168.0.191/trsAppV1/server_api/'; //HNA
    server: string = 'https://trstest.lumiactive.com/server_api/'; //HNA


    // server: string = 'http://192.168.0.1/trsAppV1/server_api/'; //HQ
    
    // server: string = 'http://192.168.0.131/trsAppV1/server_api/'; //LUMI@HNA
    // // default
    // if you test in real device "http://localhost" change use the your IP
    // server: string = "http://192.199.122.100/IONIC4_CRUD_LOGINREGIS_PHP_MYSQL/server_api/";

    constructor(public http: Http) {

    }

    postData(body, file) {
        let type = 'application/json; charset=UTF-8';
        let headers = new Headers({ 'Content-Type': type });
        let options = new RequestOptions({ headers: headers });
        console.log(body);
        console.log(file);
        return this.http.post(this.server + file, JSON.stringify(body),
            options).map(res => res.json());

    }

}
