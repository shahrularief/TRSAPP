import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
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
  @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
  @ViewChild('lineCanvasProductSold', { static: false }) lineCanvasPS: ElementRef;
  @ViewChild('barCanvasT', { static: false }) barCanvasT: ElementRef;
  @ViewChild('barCanvasP', { static: false }) barCanvasP: ElementRef;
  @ViewChild('doughnutCanvas', { static: false }) doughnutCanvas: ElementRef;
  @ViewChild('doughnutCanvasPS', { static: false }) doughnutCanvasPS: ElementRef;

  slider1 = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    observer: true,
    observeParents: true,

  };
  private doughnutChart: Chart;
  private doughnutChartPS: Chart;
  private barChartT: Chart;
  private barChartP: Chart;
  private lineChart: Chart;
  private lineChartPS: Chart;

  showAdmin: boolean = false;
  showProd: boolean = false;
  showProdOnly: boolean = false;
  showSale: boolean = false;
  showAcc: boolean = false;
  showCEO: boolean = false;

  showSaleOnly: boolean = false;
  teamrank: any;
  overallrank: any;
  username: string;
  month: string;
  displayName: string;
  users: any;
  company: string;
  tableStyle = 'bootstrap';
  totalpend: any[];
  totalsum: any[];
  todaysum: any[];
  monthsum: any[];
  totalsumceo: any[];
  todaysumceo: any[];
  monthsumceo: any[];
  newmonth: any[];
  monthgraph: any[];
  monthgraphP: any[];
  monthgraphPS: any[];
  monthgraphPSales: any;
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
  salesrankingteam: any[];
  ranking: any[];
  ranksales: any[];
  nameranking: any[];
  allranking: any[];
  rankingall: any[];
  shippingdashboard: any[];
  shippingtoday: any[];
  shippingweekly: any[];
  shippingmonthly: any[];
  unverifiedprod: any[];
  unverifys: any[];
  salesall: any[];
  salesallranking: any[];
  comission: number;
  customers: any = [];
  monthcom: any = [{ sum: 0 }];
  count: any[];
  footer_team;
  footer_team_sales;
  footer_trs_sale;
  isAdmin = false;
  isSales = false;
  isSalesOnly = false;
  isAdminOnly = false;
  constructor(
    private postPrvdr: PostProvider,
    private storage: Storage,
    private auth: AuthService,
    private modalController: ModalController,
    private menu: MenuController,

  ) {

  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.totalsum = [];
    this.todaysum = [];
    this.totalsumceo = [];
    this.todaysumceo = [];
    this.monthsumceo = [];
    this.totalpend = [];
    this.monthsum = [];
    this.monthcom = [];
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
    this.monthgraphPSales = [];
    this.monthgraph = [];
    this.daygraph = [];
    this.salesranking = [];
    this.salesrankingteam = [];
    this.ranking = [];
    this.allranking = [];
    this.rankingall = [];
    this.nameranking = [];
    this.shippingdashboard = [];
    this.shippingtoday = [];
    this.shippingweekly = [];
    this.shippingmonthly = [];
    this.unverifiedprod = [];
    this.unverifys = [];
    this.ranksales = [];
    this.salesall = [];
    this.count = [];
    this.salesallranking = [];

    this.auth.authState.subscribe(state => {
      this.users = state;
      this.displayName = this.users.username;
      this.username = this.users.username;
      this.company = this.users.company;
      this.role = this.users.role;
      console.log(this.company);
      console.log(this.users);
      console.log(this.role);
      this.checkUser();
    });

    const date = new Date();  // 2009-11-10
    const month = date.toLocaleString('default', { month: 'long' });
    this.month = month;
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
    if (this.role === 'SALES') {
      this.showSale = true;
      this.showSaleOnly = true;
      this.isAdmin = true;
      this.isAdminOnly = true;
      this.loadTotalSale();
      this.loadSaleToday();
      this.loadMonthGraphSales();
      this.loadMonthSale();
      this.loadMonthGraphByTeam();
      this.loadMonthGraphByProductSold();
      this.loadMonthGraphByProductSoldALL();
      this.loadTeamSales();
      this.loadSalesRanking();
      this.loadMonthlyComission();
      this.loadPending();


    } else if (this.role === 'BOD') {
      this.showAdmin = true;
      this.showSale = true;
      this.showProd = true;
      this.isSalesOnly = true;
      this.isAdminOnly = false;
      this.isSales = false;
      this.isAdmin = false;

      this.loadAllSale();
      this.loadAllTodaySale();
      this.loadAllMonthSale();
     
      this.loadMonthGraph();
      this.loadMonthGraphByProduct();
      this.loadMonthGraphByTeam();
      this.loadAllSalesRanking();
      this.loadMonthGraphByProductSoldALL();
      this.loadAllShipping();
      this.loadAllShippingToday();
      this.loadAllShippingWeekly();
      this.loadAllShippingMonthly();
      this.loadSalesRanking();
      this.loadTeamSales();
    } else if (this.role === 'CEO') {
      this.showAdmin = true;
      this.showSale = true;
      this.showProd = true;
      this.isSalesOnly = true;
      this.isAdminOnly = false;
      this.isSales = false;
      this.isAdmin = false;
      this.showCEO = true;
      this.loadAllSale();
      this.loadAllTodaySale();
      this.loadAllMonthSale();
      this.loadCEOSale();
      this.loadCEOTodaySale();
      this.loadCEOMonthSale();
      this.loadMonthGraph();
      this.loadMonthGraphByProduct();
      this.loadMonthGraphByTeam();
      this.loadAllSalesRanking();
      this.loadMonthGraphByProductSoldALL();
      this.loadAllShipping();
      this.loadAllShippingToday();
      this.loadAllShippingWeekly();
      this.loadAllShippingMonthly();
      this.loadSalesRanking();
      this.loadTeamSales();
    }
     else if (this.role === 'ACCOUNT' || this.role === 'ACCOUNT HEAD' ) {
      this.showAcc = true;
      this.isSales = true;
      this.isAdmin = true;
      this.isSalesOnly = true;
      this.isAdminOnly = true;
      this.loadUnverifyAcc();
    } else if (this.role === 'PRODUCTION' || this.role === 'PRODUCTION HEAD' ) {
      this.showProd = true;
      this.showProdOnly = true;
      this.isSales = true;
      this.isAdmin = true;
      this.isSalesOnly = true;
      this.isAdminOnly = true;
      this.loadUnverifyProduction();
      this.loadAllShipping();
      this.getProduct();
    } else if (this.role === 'HR') {
      this.showProd = false;
      this.showProdOnly = false;
      this.isSales = true;
      this.isAdmin = true;
      this.isSalesOnly = true;
      this.isAdminOnly = true;
      this.showAcc = false;
    } else if (this.role === 'DEV') {
      this.showAdmin = true;
      this.showSale = true;
      this.showProd = true;
      this.showAcc = true;
      this.showSaleOnly = true;
      this.loadAllSale();
      this.loadAllTodaySale();
      this.loadAllMonthSale();
      this.loadMonthGraph();
      this.loadMonthGraphByProduct();
      this.loadMonthGraphByTeam();
      this.loadAllSalesRanking();
      this.loadMonthGraphByProductSoldALL();
      this.loadAllShipping();
      this.loadAllShippingToday();
      this.loadAllShippingWeekly();
      this.loadAllShippingMonthly();
      this.loadUnverifyAcc();
      this.loadUnverifyProduction();
      this.loadAllShipping();
      this.loadTotalSale();
      this.loadSaleToday();
      this.loadMonthGraphSales();
      this.loadMonthSale();
      this.loadMonthGraphByTeam();
      this.loadMonthGraphByProductSold();
      this.loadTeamSales();
      this.loadAllSalesRanking();
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

  loadCEOSale() {
    console.log("CEO OF COMAPNAY", this.company)
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumceo',
        company: this.company,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.totalsumceo.push(sum);
          console.log('total', this.totalsumceo);
        }
        resolve(true);
      });
    });
  }
  loadCEOTodaySale() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumceotoday',
        company: this.company,

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.todaysumceo.push(sum);
          console.log('total' + this.todaysumceo);
        }
        resolve(true);
      });
    });
  }
  loadCEOMonthSale() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumceomonth',
        company: this.company,

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthsumceo.push(sum);
          console.log('total monthsumceo', this.monthsumceo);
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
        console.log("this.Prod", this.Pprod)

        let anArray = [];
        let parts;
        let secondparts;
        let ndArray = [];
        for (let i = 0; i < this.Pprod.length; i++) {
          parts = this.Pprod[i].split(",");

          for (let n = 0; n < parts.length; n++) {
            anArray.push(parts[n]);
            console.log("parts", parts);
          }
          console.log("anarray", anArray)
        }

        for (let i = 0; i < anArray.length; i++) {
          secondparts = anArray[i].split("-");
          ndArray.push({ produk: secondparts[0], total: secondparts[1] });
          console.log("2parts", ndArray);
        }

        let addprod = [];

        ndArray.forEach(function (a) {
          if (!this[a.produk]) {
            this[a.produk] = { produk: a.produk, total: 0 };
            addprod.push(this[a.produk]);
          }
          this[a.produk].total += +a.total;
        }, Object.create(null));
        console.log('addprod', addprod);

        const pro = [];
        const proBil = [];

        for (const pm of addprod) {
          pro.push(pm.produk)
          proBil.push(pm.total);

        }


        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
          type: "doughnut",
          data: {
            labels: pro,
            datasets: [
              {
                label: "Bil Produk",
                data: proBil,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)"
                ],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
              }
            ]
          }
        });

      });

    });


  }
  loadMonthGraphByTeam() {

    return new Promise(resolve => {
      const body = {
        aksi: 'getgraphmonthbycompany',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthgraphT.push(sum);
        }
        resolve(true);
        console.log('TmonthGraph', this.monthgraphT);
        const teamteam = [];

        this.monthgraphT.forEach(function (a) {
          if (!this[a.company]) {
            this[a.company] = { company: a.company, jumlah_bayaran: 0 };
            teamteam.push(this[a.company]);
          }
          this[a.company].jumlah_bayaran += +a.jumlah_bayaran;
        }, Object.create(null));


        for (const tm of teamteam) {
          this.Tteam.push(tm.company);
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
                    labelString: 'Sale'
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

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesranking.push(sales);
        }
        resolve(true);
        console.log(' loadAllSalesRanking:' + this.salesranking);
        let ranking = [];

        this.salesranking.forEach(function (a) {
          if (!this[a.company]) {
            this[a.company] = { company: a.company, jumlah_bayaran: 0, jumProduk: 0 };
            ranking.push(this[a.company]);
          }
          this[a.company].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.company].jumProduk += +a.jumProduk;
        }, Object.create(null));
        console.log(' loadAllSalesRanking', ranking);
        this.ranking = ranking.concat();

        for (let i = 0; i < this.ranking.length; i++) {
          this.ranking[i].jumlah_bayaran = parseFloat(this.ranking[i].jumlah_bayaran);
          this.ranking[i].jumlah_bayaran = this.ranking[i].jumlah_bayaran.toFixed(2);
          console.log(this.ranking[i].jumlah_bayaran)
        }
       

        this.ranking.sort(function (a, b) {
          return b.jumlah_bayaran - a.jumlah_bayaran;
        });

        let sum = 0;
        let sumfin;
        for (let i = 0; i < this.ranking.length; i++) {
        
          sum += +this.ranking[i].jumlah_bayaran;
          sumfin = Math.round(sum * 100) / 100
          console.log("ranking",sumfin);
        }
        this.footer_trs_sale = sumfin;

        this.ranking = this.ranking.map(row => ({
          id: row['id'],
          company: row['company'],
          jumProduk: row['jumProduk'],
          jumlah_bayaran: row['jumlah_bayaran'],
        }));

        console.log('Team rank', this.ranking);
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
            maintainAspectRatio: false,
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
        aksi: 'getshippingtotal',

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
  loadAllShippingToday() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getshippingtoday',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const ship of data.result) {
          this.shippingtoday.push(ship);
        }
        resolve(true);
        console.log(this.shippingdashboard);
      });
    });
  }
  loadAllShippingWeekly() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getshippingweekly',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const ship of data.result) {
          this.shippingweekly.push(ship);
        }
        resolve(true);
        console.log(this.shippingdashboard);
      });
    });
  }
  loadAllShippingMonthly() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getshippingmonthly',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const ship of data.result) {
          this.shippingmonthly.push(ship);
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

  loadPending() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getsumpending',
        sales_username: this.username,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.totalpend.push(sum);
          console.log('total pending', this.totalpend);
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
  loadMonthlyComission() {
    return new Promise(resolve => {
      const body = {
        username: this.username,
        aksi: 'getsumsalesmonth',
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sum of data.result) {
          this.monthcom.push(sum);

        }
        console.log('total', this.monthcom);
        resolve(true);
        let monthC = this.monthcom[0].sum;
        console.log("comission", monthC);
        let mc: number;
        mc = +monthC;
        console.log(mc);
        if (mc < 10000) {
          console.log("less than 10K");
          let calc;
          calc = mc * (5 / 100);
          this.comission = calc.toFixed(2);
        } else if (mc >= 10000 && mc < 20000) {
          let calc;
          calc = mc * (7 / 100);
          this.comission = calc.toFixed(2);

        } else if (mc >= 20000) {
          if (mc >= 20000 && mc < 25000) {
            let calc;
            calc = mc * (10 / 100);
            this.comission = calc.toFixed(2);
          } else if (mc >= 25000 && mc < 30000) {
            let calc;
            calc = mc * (10 / 100) + 500;
            this.comission = calc.toFixed(2);
          } else if (mc >= 30000 && mc < 40000) {
            let calc;
            calc = mc * (10 / 100) + 1000;
            this.comission = calc.toFixed(2);
          } else if (mc >= 40000 && mc < 50000) {
            let calc;
            calc = mc * (10 / 100) + 1500;
            this.comission = calc.toFixed(2);
          } else if (mc >= 50000 && mc < 60000) {
            let calc;
            calc = mc * (10 / 100) + 2000;
            this.comission = calc.toFixed(2);
          } else if (mc >= 60000 && mc < 70000) {
            let calc;
            calc = mc * (10 / 100) + 2500;
            this.comission = calc.toFixed(2);
          }
          else if (mc >= 70000 && mc < 80000) {
            let calc;
            calc = mc * (10 / 100) + 3000;
            this.comission = calc.toFixed(2);
          }
          else if (mc >= 80000 && mc < 90000) {
            let calc;
            calc = mc * (10 / 100) + 3500;
            this.comission = calc.toFixed(2);
          }
        }



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
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          }
        });
      });

    });
  }

  graphProductSoldSale(pro, proBil) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAA", pro, proBil);
    console.log(this.doughnutCanvas.nativeElement);
    this.doughnutChartPS = new Chart(this.doughnutCanvas.nativeElement, {
      type: "pie",
      data: {
        labels: pro,
        datasets: [
          {
            label: "Bil Produk",
            data: proBil,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB"
              , "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
          }
        ]
      }
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
          this.monthgraphPSales.push(sum);
        }
        resolve(true);
        console.log('monthgraphPSales', this.monthgraphPSales);

        let produkPS = [];
        for (let i = 0; i < this.monthgraphPSales.length; i++) {
          produkPS.push(this.monthgraphPSales[i].produk);

        }
        let anArray = [];
        let parts;
        let secondparts;
        let ndArray = [];
        for (let i = 0; i < produkPS.length; i++) {
          parts = produkPS[i].split(",");

          for (let n = 0; n < parts.length; n++) {
            anArray.push(parts[n]);
            console.log("parts", parts);
          }
          console.log("anarray", anArray)
        }

        for (let i = 0; i < anArray.length; i++) {
          secondparts = anArray[i].split("-");
          ndArray.push({ produk: secondparts[0], total: secondparts[1] });
          console.log("2parts", ndArray);
        }

        let addprod = [];

        ndArray.forEach(function (a) {
          if (!this[a.produk]) {
            this[a.produk] = { produk: a.produk, total: 0 };
            addprod.push(this[a.produk]);
          }
          this[a.produk].total += +a.total;
        }, Object.create(null));
        console.log('addprod', addprod);

        const pro = [];
        const proBil = [];

        for (const pm of addprod) {
          pro.push(pm.produk)
          proBil.push(pm.total);

        }
        console.log("pro", pro, "pro", proBil);



        this.graphProductSold(proBil, pro)

      });

    });
  }

  graphProductSold(num, letr) {
    console.log('PSjb ggg PRODUCT SOLD', num);
    this.doughnutChart = new Chart(this.doughnutCanvasPS.nativeElement, {
      type: "doughnut",
      data: {
        labels: letr,
        datasets: [
          {
            label: "Bil Produk",
            data: num,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
          }
        ]
      }
    });
  }


  loadTeamSales() {
    return new Promise(resolve => {
      const body = {
        company: this.company,
        aksi: 'getrankingsales',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let sales of data.result) {
          this.salesrankingteam.push(sales);
        }
        resolve(true);
        console.log('loadTeamSales:' + this.salesrankingteam);
        let ranksales = [];

        this.salesrankingteam.forEach(function (a) {
          if (!this[a.sales]) {

            this[a.sales] = { sales: a.sales, jumProduk: 0, jumlah_bayaran: 0 };
            ranksales.push(this[a.sales]);
          }
          this[a.sales].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales].jumProduk += +a.jumProduk;

        }, Object.create(null));
        console.log('loadTeamSales', ranksales);
        this.ranksales = ranksales.concat();

        for (let i = 0; i < this.ranksales.length; i++) {
          this.ranksales[i].jumlah_bayaran = parseFloat(this.ranksales[i].jumlah_bayaran);
          this.ranksales[i].jumlah_bayaran = this.ranksales[i].jumlah_bayaran.toFixed(2);
          console.log(this.ranksales[i].jumlah_bayaran)
        }
       

        this.ranksales.sort(function (a, b) {
          return b.jumlah_bayaran - a.jumlah_bayaran;
        });
        console.log('NloadTeamSales', this.ranksales);
        let index = this.ranksales.findIndex(x => x.sales === this.username);
        console.log("index team sale", index);
        this.teamrank = index + 1;

        let sum = 0;
        let sumfin;
        for (let i = 0; i < this.ranksales.length; i++) {
         
          sum += +this.ranksales[i].jumlah_bayaran;
          sumfin = Math.round(sum * 100) / 100
          console.log("ranksales",sumfin);
        }
        this.footer_team = sumfin;
      });
      this.ranksales = this.ranksales.map(row => ({
        id: row['id'],
        nama: row['sales'],
        jumProduk: row['jumProduk'],
        jumlah_bayaran: row['jumlah_bayaran'],
      }));






    });

  }

  ////////////////// ranking sales all
  loadSalesRanking() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getrankingsalesall',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesallranking.push(sales);
        }
        resolve(true);

        let ranksales = [];

        this.salesallranking.forEach(function (a) {
          if (!this[a.sales]) {

            this[a.sales] = { sales: a.sales, jumProduk: 0, jumlah_bayaran: 0 };
            ranksales.push(this[a.sales]);
          }
          this[a.sales].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales].jumProduk += +a.jumProduk;

        }, Object.create(null));

        this.salesall = ranksales.concat();

        for (let i = 0; i < this.salesall.length; i++) {
          this.salesall[i].jumlah_bayaran = parseFloat(this.salesall[i].jumlah_bayaran);
          this.salesall[i].jumlah_bayaran = this.salesall[i].jumlah_bayaran.toFixed(2);
          console.log(this.salesall[i].jumlah_bayaran)
        }
       

        this.salesall.sort(function (a, b) {
          return b.jumlah_bayaran - a.jumlah_bayaran;
        });
        console.log('loadSalesRanking', this.salesall);
        let index = this.salesall.findIndex(x => x.sales === this.username);
        console.log("index overall", index);
        this.overallrank = index + 1;

        let sum = 0;
        let sumfin;
        for (let i = 0; i < this.salesall.length; i++) {
          let parse = parseFloat(this.salesall[i].jumlah_bayaran);
          let add = parse.toFixed(2);
          sum += +add;
          sumfin = Math.round(sum * 100) / 100
          console.log("salesall",sumfin);
        }
        this.footer_team_sales = sumfin;

      });
      this.salesall = this.salesall.map(row => ({
        nama: row['sales'],
        jumProduk: row['jumProduk'],
        jumlah_bayaran: row['jumlah_bayaran'],
      }));

    });

  }

  //PROOOOODUCTIOOON

  loadUnverifyProduction() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getunverifyproduction',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(Cresult => {
        for (const verify of Cresult.result) {
          this.unverifiedprod.push(verify);

        }
        resolve(true);
        console.log('unverified items production:' + this.unverifiedprod);
      });
    });
  }

  getProduct() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getproduct',

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const prod of data.result) {
          this.count.push(prod);
          console.log('Products:' + this.count);
        }
        this.count = this.count.map(row => ({
          prodName: row['prodName'],
          stock: row['stock']
        }));
        resolve(true);
        console.log(this.count);
      });
    });
  }


  //ACOOUUNNTTT

  loadUnverifyAcc() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getunverify',

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
