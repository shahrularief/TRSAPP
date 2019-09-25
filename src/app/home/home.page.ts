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
  @ViewChild('lineCanvasProductSold') lineCanvasPS: ElementRef;
  @ViewChild('barCanvasT') barCanvasT: ElementRef;
  @ViewChild('barCanvasP') barCanvasP: ElementRef;

  slider1 = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
    },
  };

  private barChartT: Chart;
  private barChartP: Chart;
  private lineChart: Chart;
  private lineChartPS: Chart;

  showAdmin: boolean = false;
  showProd: boolean = false;
  showSale: boolean = false;
  showAcc: boolean = false;

  username: string;
  users: any;
  team: string;

  totalsum: any[];
  todaysum: any[];
  monthsum: any[];
  newmonth: any[];
  monthgraph: any[];
  monthgraphP: any[];
  monthgraphPS: any[];
  monthgraphT: any[];
  daygraph: any[];
  months: any[];
  jb: any[];
  Pmonths: any[];
  Pjb: any[];
  Pprod: any[];
  PSjb: any[];
  PSmonth: any[];
  Tteam: any[];
  Tjb: any[];
  role: string;
  salesranking: any[];
  ranking: any[];
  ranksales:any[];
  nameranking: any[];
  allranking: any[];
  rankingall: any[];
  shippingdashboard: any[];
  unverifiedprod: any[];
  unverifys: any[];

  limit = 13; // LIMIT GET PERDATA
  start = 0;
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
    this.Pmonths = [];
    this.Pjb = [];
    this.Pprod = [];
    this.PSjb = [];
    this.PSmonth = [];
    this.Tteam = [];
    this.Tjb = [];
    this.monthgraphT = [];
    this.monthgraphP = [];
    this.monthgraphPS = [];
    this.monthgraph = [];
    this.daygraph = [];
    this.salesranking = [];
    this.ranking = [];
    this.allranking = [];
    this.rankingall = [];
    this.nameranking = [];
    this.shippingdashboard = [];
    this.unverifiedprod = [];
    this.unverifys = [];
    this.ranksales = [];
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
      this.showSale = true;
      this.loadTotalSale();
      this.loadSaleToday();
      this.loadMonthGraphSales();
      this.loadMonthSale();
      this.loadMonthGraphByTeam();
      this.loadMonthGraphByProductSold();
      this.loadTeamSales();
    } else if (this.role === 'CEO' || this.role === 'BOD') {
      this.showAdmin = true;
      this.showSale = true;
      this.showProd = true;
      this.loadAllSale();
      this.loadAllTodaySale();
      this.loadAllMonthSale();
      this.loadMonthGraph();
      this.loadMonthGraphByProduct();
      this.loadMonthGraphByTeam();
      this.loadAllSalesRanking();
      this.loadMonthGraphByProductSoldALL();
      this.loadAllShipping();
      this.loadTeamSales();
    } else if (this.role === 'ACCOUNT') {
      this.showAcc = true;
      this.loadUnverifyAcc();
    } else if (this.role === 'PRODUCTION') {
      this.showProd = true;
      this.loadUnverifyProduction();
      this.loadAllShipping();
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
        const newmonth = [];

        this.monthgraph.forEach(function (a) {
          if (!this[a.month]) {
            this[a.month] = { month: a.month, jumlah_bayaran: 0 };
            newmonth.push(this[a.month]);
          }
          this[a.month].jumlah_bayaran += +a.jumlah_bayaran;
        }, Object.create(null));


        for (const nm of newmonth) {
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
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Jumlah (RM)'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Bulan'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      });

    });


  }
  loadMonthGraphByProduct() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getgraphmonthbyproduct',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthgraphP.push(sum);
        }
        resolve(true);
        console.log('monthgraphP', this.monthgraphP);
        const prodmonth = [];

        this.monthgraphP.forEach(function (a) {
          if (!this[a.produk]) {
            this[a.produk] = { produk: a.produk, jumlah_bayaran: 0 };
            prodmonth.push(this[a.produk]);
          }
          this[a.produk].jumlah_bayaran += +a.jumlah_bayaran;
        }, Object.create(null));


        for (const pm of prodmonth) {
          this.Pjb.push(pm.jumlah_bayaran);
          this.Pprod.push(pm.produk);
        }

        console.log('Pjb', this.Pjb);
        console.log('Pprod', this.Pprod);
        console.log('prodMonth', prodmonth);

        this.barChartP = new Chart(this.barCanvasP.nativeElement, {
          type: 'bar',
          data: {
            labels: this.Pprod,
            datasets: [
              {
                label: 'Sold',
                data: this.Pjb,
                backgroundColor: [
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',
                  'rgba(255,99,132,1)',


                ],
                borderWidth: 0.5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Jumlah (RM)'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Produk'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      });

    });


  }
  loadMonthGraphByTeam() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getgraphmonthbyteam',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthgraphT.push(sum);
        }
        resolve(true);
        console.log('TmonthGraph', this.monthgraphT);
        const teamteam = [];

        this.monthgraphT.forEach(function (a) {
          if (!this[a.sales_team]) {
            this[a.sales_team] = { sales_team: a.sales_team, jumlah_bayaran: 0 };
            teamteam.push(this[a.sales_team]);
          }
          this[a.sales_team].jumlah_bayaran += +a.jumlah_bayaran;
        }, Object.create(null));


        for (const tm of teamteam) {
          this.Tteam.push(tm.sales_team);
          this.Tjb.push(tm.jumlah_bayaran);
        }
        console.log('Tteam', this.Tteam);
        console.log('Tjb', this.Tjb);
        console.log('teamteam', teamteam);

        this.barChartT = new Chart(this.barCanvasT.nativeElement, {
          type: 'bar',
          data: {
            labels: this.Tteam,
            datasets: [
              {
                label: 'Teams',
                data: this.Tjb,
                backgroundColor: [
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',

                ],
                borderColor: [
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',
                  'rgba(102,153,204,1)',



                ],
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Jumlah (RM)'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Team'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      });

    });


  }
  loadAllSalesRanking() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getrankingall',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesranking.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesranking);
        let ranking = [];

        this.salesranking.forEach(function (a) {
          if (!this[a.sales_team]) {
            this[a.sales_team] = { sales_team: a.sales_team, jumlah_bayaran: 0, jumProduk: 0 };
            ranking.push(this[a.sales_team]);
          }
          this[a.sales_team].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales_team].jumProduk += +a.jumProduk;
        }, Object.create(null));
        console.log('ranking', ranking);
        this.ranking = ranking.concat();
        this.ranking.sort(function (a, b) {
          return b.jumlah_bayaran - a.jumlah_bayaran;
        });

        console.log('Nranking', this.ranking);
      });
    });
  }
  loadMonthGraphByProductSoldALL() {

    return new Promise(resolve => {
      const body = {
        username: this.username,
        aksi: 'getgraphproductsoldall',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthgraphPS.push(sum);
        }
        resolve(true);
        console.log('monthgraphPS', this.monthgraphPS);
        const psmonth = [];

        this.monthgraphPS.forEach(function (a) {
          if (!this[a.month]) {
            this[a.month] = { month: a.month, jumProduk: 0 };
            psmonth.push(this[a.month]);
          }
          this[a.month].jumProduk += +a.jumProduk;
        }, Object.create(null));


        for (const psm of psmonth) {
          this.PSjb.push(psm.jumProduk);
          this.PSmonth.push(psm.month);
        }

        console.log('PSjb', this.PSjb);
        console.log('PSmonth', this.PSmonth);
        console.log('psmonth', psmonth);

        this.lineChartPS = new Chart(this.lineCanvasPS.nativeElement, {
          type: 'line',
          data: {
            labels: this.PSmonth,
            datasets: [
              {
                label: 'Total Unit Monthly',
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
                data: this.PSjb,
                spanGaps: false
              }
            ]

          },
          options: {
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Jumlah Unit'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Produk'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      });

    });


  }
  loadAllShipping() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getshippingdashboard',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const ship of data.result) {
          this.shippingdashboard.push(ship);
        }
        resolve(true);
        console.log(this.shippingdashboard);
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
        const newmonth = [];

        this.monthgraph.forEach(function (a) {
          if (!this[a.month]) {
            this[a.month] = { month: a.month, jumlah_bayaran: 0 };
            newmonth.push(this[a.month]);
          }
          this[a.month].jumlah_bayaran += +a.jumlah_bayaran;
        }, Object.create(null));


        for (const nm of newmonth) {
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
  loadMonthGraphByProductSold() {

    return new Promise(resolve => {
      const body = {
        username: this.username,
        aksi: 'getgraphproductsold',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthgraphPS.push(sum);
        }
        resolve(true);
        console.log('monthgraphPS', this.monthgraphPS);
        const psmonth = [];

        this.monthgraphPS.forEach(function (a) {
          if (!this[a.month]) {
            this[a.month] = { month: a.month, jumProduk: 0 };
            psmonth.push(this[a.month]);
          }
          this[a.month].jumProduk += +a.jumProduk;
        }, Object.create(null));


        for (const psm of psmonth) {
          this.PSjb.push(psm.jumProduk);
          this.PSmonth.push(psm.month);
        }

        console.log('PSjb', this.PSjb);
        console.log('PSmonth', this.PSmonth);
        console.log('psmonth', psmonth);

        this.lineChartPS = new Chart(this.lineCanvasPS.nativeElement, {
          type: 'line',
          data: {
            labels: this.PSmonth,
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
                data: this.PSjb,
                spanGaps: false
              }
            ]
          }
        });
      });

    });


  }
  loadTeamSales() {
    return new Promise(resolve => {
      const body = {
        sales_team: this.team,
        aksi: 'getrankingsales',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesranking.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesranking);
        let ranksales = [];

        this.salesranking.forEach(function (a) {
          if (!this[a.sales]) {
            this[a.sales] = { sales: a.sales, jumProduk: 0, jumlah_bayaran: 0 };
            ranksales.push(this[a.sales]);
          }
          this[a.sales].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales].jumProduk += +a.jumProduk;
        }, Object.create(null));
        console.log('ranking', ranksales);
        this.ranksales = ranksales.concat();
        this.ranksales.sort(function (a, b) {
          return b.jumlah_bayaran - a.jumlah_bayaran;
        });
        console.log('Nranking', this.ranksales);

      });
    });
  }

  //PROOOOODUCTIOOON

  loadUnverifyProduction() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getunverifyproduction',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(Cresult => {
        for (const verify of Cresult.result) {
          this.unverifiedprod.push(verify);
          console.log('unverified items production:' + this.unverifiedprod);
        }
        resolve(true);

      });
    });
  }

  //ACOOUUNNTTT

  loadUnverifyAcc() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getunverify',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(Cresult => {
        for (const verify of Cresult.result) {
          this.unverifys.push(verify);
          console.log('unverified items:' + this.unverifys);
        }
        resolve(true);

      });
    });
  }
}
