import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  employees: any[];
  emp: any[];
  tableColumns: any[];
  tableStyle = 'bootstrap'

  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
    public datatable: NgxDatatableModule,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.employees = [];
    this.emp = [];
    this.loadEmployee();
  }
  loadEmployee() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getemployee',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let comp of data.result) {

          this.employees.push(comp);
          console.log('Employee:' + this.employees);
        }

        resolve(true);
        this.employees = this.employees.map(row => ({
          username: row['username'],
          fullname: row['fullname'],
          nickname: row['nickname'],
          userhp: row['userhp'],
          userEmail: row['userEmail'],
          role: row['role'],
          company: row['company'],
          userID: row['userID'],
          password: row['password'],
          status: row['status'],
        }));
        console.log("map", this.employees);
      });
    });
  }

  updateEmployee(user, full, nick, hp, emel, role, comp, id, pass) {
    let source = "employee";
    let details = {
      userID: id,
      username: user,
      password: pass,
      role: role,
      fullname: full,
      userhp: hp,
      userEmail: emel,
      company: comp,
      nickname: nick,
      source,
    }
    let navigationExtras: NavigationExtras = {
      state: {
        user: details
      }
    };
    console.log("ne", navigationExtras)
    this.router.navigate(['updateemployee'], navigationExtras);
  }

  async deleteEmployee(id) {
    console.log(id);
    const alert = await this.alertCtrl.create({
      header: 'Delete!',
      message: 'Adakah anda pasti?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.delEmployee(id);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  delEmployee(id) {
    const body = {
      aksi: 'deleteemployee',
      userID: id
    };
    this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
      this.ionViewWillEnter();
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    if (val && val.trim() !== '') {
      const temp = this.employees.filter(function (d) {
        return d.fullname.toLowerCase().indexOf(val) !== -1 || !val || d.company.toLowerCase().indexOf(val) !== -1;
      });
      this.employees = temp;
    } else {
      this.employees = [];
      this.loadEmployee();
    }
  }


  getStatus(status) {
    let col;
    if (status == 'n') {
      return col = 'danger'
    } else if (status == 'y') {
      return col = 'success'
    } else if (status == 'cod') {
      return col = 'dark'
    } else if (status == 'codpending') {
      return col = 'tertiary'
    }
  }
  goList() {
    this.router.navigateByUrl('/registration');
  }

  async verifyAlert(id) {
    const alert = await this.alertCtrl.create({
      header: 'Aktifkan?',
      message: 'Sila pilih',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log('Confirm Cancel', id);
          }
        }, {
          text: 'Aktif',
          handler: data => {

            let sah = 'y';
            this.verifyStatus(id, sah);
            console.log('Confirm Okay', id, sah);

          }
        }
      ]
    });

    await alert.present();
  }



  async verifyStatus(id, sah) {
    return new Promise(resolve => {
      const body = {
        aksi: 'updatestatusemployee',
        userID: id,
        status: sah,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        this.router.navigate(['/employee']);


      });
      resolve(true);
      console.log('OK');
      this.employees = [];
      this.loadEmployee();
    });

  }


}
