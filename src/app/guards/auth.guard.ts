import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthService, private alertCtrl: AlertController) { }

  canActivate(route: ActivatedRouteSnapshot) {
    const expectedRole = route.data.role;

    return this.auth.user.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.showAlert();
          return this.router.parseUrl('/home');
        } else {
          let role = user['role'];

          if (expectedRole === role) {
            return true;
          } else {
            this.showAlert();
            return this.router.parseUrl('/home');
          }
        }
      })
    )
  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorized',
      message: 'You are not authorized to access this page!',
      buttons: ['OK']
    });
    alert.present();

  }
}