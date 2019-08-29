import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'user-access-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<any>;
  private authState = new BehaviorSubject(null);
  users: any;
  sales: string;

  constructor(private router: Router, private storage: Storage) {
    this.loadUser();

    // Filter out null values which is first behaviour Subject value
    this.user = this.authState
      .asObservable()
      .pipe(filter(response => response));
  }

  loadUser() {
    // Normally load e.g. JWT at this point
    this.storage.get(TOKEN_KEY).then(data => {
      if (data) {
        this.authState.next(data);
      } else {
        this.authState.next({ username: null, password: null, role: null });
      }
    });
  }
  signInAdmin(credentials) {
    let username = credentials.username;
    let password = credentials.password;
    let role = credentials.role;
    let user = null;

    if (username !== '' && password !== '') {
      user = { username, password, role };
    } else {
      console.log("no data");

    }

    this.authState.next(user);
    // Normally you would store e.g. JWT
    this.storage.set(TOKEN_KEY, user);

    // Normally you would have a real user object at this point
    return of(user);
  }

  signInAccProd(credentials) {
    let username = credentials.accprod_username;
    let password = credentials.accprod_password;
    let role = credentials.accprod_role;
    let user = null;

    if (username !== '' && password !== '') {
      user = { username, password, role };
    } else {
      console.log("no data");

    }

    this.authState.next(user);
    // Normally you would store e.g. JWT
    this.storage.set(TOKEN_KEY, user);

    // Normally you would have a real user object at this point
    return of(user);
  }

  signInSales(credentials) {
    let username = credentials.sales_username;
    let password = credentials.sales_password;
    let role = credentials.sales_role;
    let user = null;

    if (username !== '' && password !== '') {
      user = { username, password, role };
    } else {
      console.log("no data");

    }

    this.authState.next(user);
    // Normally you would store e.g. JWT
    this.storage.set(TOKEN_KEY, user);

    // Normally you would have a real user object at this point
    return of(user);
  }

  async signOut() {
    await this.storage.set(TOKEN_KEY, null);
    this.authState.next(null);
    this.router.navigateByUrl('/login');
  }
  public getStoredData() {
    return this.storage.get(TOKEN_KEY).then((val) => { // <-- Here!
      console.log(val);
      val = this.users;
      this.sales = this.users.username;
      console.log(this.sales);
      return of(this.sales);
    });
  }

}
