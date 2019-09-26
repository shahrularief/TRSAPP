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
  public authState = new BehaviorSubject(null);
  users: any;
  sales: string;
  isLogged: boolean;

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

  signInEmployee(credentials) {

    let username = credentials.username;
    let password = credentials.password;
    let role = credentials.role;
    let fullname = credentials.fullname;
    let userhp = credentials.userhp;
    let userEmail = credentials.userEmail;
    let company = credentials.company;
    let nickname = credentials.nickname;

    let user = null;

    if (username !== '' && password !== '') {
      user = { nickname, fullname, userhp, username, password, role, userEmail, company };
      this.router.navigateByUrl('/home');
      console.log(user);
    } else {
      console.log('no data');

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
    this.storage.clear();
    this.router.navigateByUrl('/login');
    console.log(this.storage);
    console.log(this.authState);
  }
}
