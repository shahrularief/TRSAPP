import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { PostProvider } from '../../providers/post-provider';
import { AuthService } from '../services/auth.service';


const TOKEN_KEY = 'user-access-token';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('lineCanvas') lineCanvas: ElementRef;
  private lineChart: Chart;
  username: string;
  users: any;
  team: string;
  totalsum: any[];
  todaysum: any[];
  monthsum: any[];
  newmonth: any[];
  monthgraph: any[];
  daygraph: any[];
  months: any[];
  jb: any[];
  role: string;

  limit: number = 13; // LIMIT GET PERDATA
  start: number = 0;
  customers: any = [];
  constructor(
    private postPrvdr: PostProvider,
    private storage: Storage,
    private auth: AuthService,


  ) { }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.totalsum = [];
    this.todaysum = [];
    this.monthsum = [];
    this.newmonth = [];
    this.months = [];
    this.jb = [];

    this.monthgraph = [];
    this.daygraph = [];
    this.storage.get(TOKEN_KEY).then((res) => {
      this.users = res;
      this.username = this.users.username;
      this.team = this.users.team;
      this.role = this.users.role;
      console.log(res);
      console.log(this.role);
      this.checkUser();
    });
  }

  processLogout() {
    this.auth.signOut();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }

  checkUser() {
    if (this.role === 'TEAM SALES') {
      this.loadTotalSale();
      this.loadSaleToday();
      this.loadMonthGraphSales();
      this.loadMonthSale();
    } else {
      this.loadAllSale();
      this.loadAllTodaySale();
      this.loadAllMonthSale();
      this.loadMonthGraph();
    }

  }

// ALL --> ADMIN // CEO // BOD
  loadAllSale() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumall',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.totalsum.push(sum);
          console.log('total', this.totalsum);
        }
        resolve(true);
      });
    });
  }
  loadAllTodaySale() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumalltoday',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.todaysum.push(sum);
          console.log('total' + this.totalsum);
        }
        resolve(true);
      });
    });
  }

  loadAllMonthSale() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumallmonth',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthsum.push(sum);
          console.log('total', this.monthsum);
        }
        resolve(true);
      });
    });
  }
  loadMonthGraph() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getgraphmonth',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthgraph.push(sum);
        }
        resolve(true);
        console.log('monthgraph', this.monthgraph);
        let newmonth = [];

        this.monthgraph.forEach(function (a) {
          if (!this[a.month]) {
            this[a.month] = { month: a.month, jumlah_bayaran: 0 };
            newmonth.push(this[a.month]);
          }
          this[a.month].jumlah_bayaran += +a.jumlah_bayaran;
        }, Object.create(null));


        for (let nm of newmonth) {
          this.months.push(nm.month);
          this.jb.push(nm.jumlah_bayaran);
        }
        console.log('month', this.months);
        console.log('jb', this.jb);
        console.log('newmonth', newmonth);

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.months,
            datasets: [
              {
                label: 'Total Sale Monthly',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                // pointHitRadius: 10,
                data: this.jb,
                spanGaps: false
              }
            ]
          }
        });
      });

    });


  }


// SALES --> SALES ONLY BRUH
  loadTotalSale() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsum',
        sales_username: this.username,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.totalsum.push(sum);
          console.log('total' + this.totalsum);
        }
        resolve(true);
      });
    });
  }
  loadSaleToday() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumtoday',
        sales_username: this.username,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sumT of data.result) {
          this.todaysum.push(sumT);
          console.log('total' + this.todaysum);
        }
        resolve(true);
      });
    });
  }
  loadMonthSale() {
    return new Promise(resolve => {
      const body = {
        username: this.username,
        aksi: 'getsumsalesmonth',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthsum.push(sum);
          console.log('total', this.monthsum);
        }
        resolve(true);
      });
    });
  }
  loadMonthGraphSales() {

    return new Promise(resolve => {
      const body = {
        username: this.username,
        aksi: 'getgraphmonthsales',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthgraph.push(sum);
        }
        resolve(true);
        console.log('monthgraph', this.monthgraph);
        let newmonth = [];

        this.monthgraph.forEach(function (a) {
          if (!this[a.month]) {
            this[a.month] = { month: a.month, jumlah_bayaran: 0 };
            newmonth.push(this[a.month]);
          }
          this[a.month].jumlah_bayaran += +a.jumlah_bayaran;
        }, Object.create(null));


        for (let nm of newmonth) {
          this.months.push(nm.month);
          this.jb.push(nm.jumlah_bayaran);
        }
        console.log('month', this.months);
        console.log('jb', this.jb);
        console.log('newmonth', newmonth);

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: this.months,
            datasets: [
              {
                label: 'Total Sale Monthly',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                // pointHitRadius: 10,
                data: this.jb,
                spanGaps: false
              }
            ]
          }
        });
      });

    });


  }


}
