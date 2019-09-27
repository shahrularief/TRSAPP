import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { PostProvider } from '../../../providers/post-provider';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  employees: any[];
 
  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.employees = [];
   
    this.loadEmployee();
   }
   loadEmployee() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getemployee',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const comp of data.result) {
          this.employees.push(comp);
          console.log('Employee:' + this.employees);
        }
        resolve(true);
      });
    });
  }


  onSearchTerm(ev: CustomEvent) {
    const val = ev.detail.value;

    if (val && val.trim() !== '') {
      this.employees = this.employees.filter(term => {
        return term.fullname.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    } else {
      this.employees = [];
      this.loadEmployee();
    }
  }
  goList(){
    this.router.navigateByUrl('/registration');
  }

}
