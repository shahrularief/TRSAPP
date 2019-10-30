import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
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
        }));
        console.log("map", this.employees);
      });
    });
  }

  updateEmployee(user,full,nick,hp,emel,role,comp,id,pass){
    this.router.navigate(['/updateemployee/' + user + '/' + full + '/' + nick + '/' + hp + '/' + emel + '/' + role + '/'
    + comp + '/' + id  + '/' + pass]);
  }

  async deleteEmployee(id){
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
    const temp = this.employees.filter(function(d) {
      return d.fullname.toLowerCase().indexOf(val) !== -1 || !val || d.company.toLowerCase().indexOf(val) !== -1;
    });
    this.employees = temp;
  } else {
    this.employees = [];
    this.loadEmployee();
  }
}

switchStyle() {
  if (this.tableStyle == 'dark'){
    this.tableStyle = 'bootstrap';
  } else {
    this.tableStyle = 'dark';
  }
}



  // onSearchTerm(ev: CustomEvent) {
  //   const val = ev.detail.value;

  //   if (val && val.trim() !== '') {
  //     this.employees = this.employees.filter(term => {
  //       return term.fullname.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
  //     });
  //   } else {
  //     this.employees = [];
  //     this.loadEmployee();
  //   }
  // }
  goList() {
    this.router.navigateByUrl('/registration');
  }

}
