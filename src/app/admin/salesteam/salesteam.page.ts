import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PostProvider } from '../../../providers/post-provider';
import { IonSlides } from '@ionic/angular';

const TOKEN_KEY = 'user-access-token';

@Component({
  selector: 'app-salesteam',
  templateUrl: './salesteam.page.html',
  styleUrls: ['./salesteam.page.scss'],
})
export class SalesteamPage implements OnInit {

  salesranking: any[];
  ranking: any[];
  salesrankingW: any[];
  rankingW: any[];
  salesrankingM: any[];
  rankingM: any[];
  sliderOne: any;
  limit = 13; // LIMIT GET PERDATA
  start = 0;

  slider1 = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
  };
 
  constructor(
    private postPrvdr: PostProvider,
    private storage: Storage,
  ) {
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.salesranking = [];
    this.ranking = [];
    this.salesrankingW = [];
    this.rankingW = [];
    this.salesrankingM = [];
    this.rankingM = [];
    this.loadSalesRankToday();
    this.loadSalesRankWeekly();
    this.loadSalesRankMonthly();
  }
  loadSalesRankToday() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getrankingteamdaily',
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

  loadSalesRankWeekly() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getrankingteamweekly',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesrankingW.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesrankingW);
        let rankingW = [];

        this.salesrankingW.forEach(function (a) {
          if (!this[a.sales_team]) {
            this[a.sales_team] = { sales_team: a.sales_team, jumlah_bayaran: 0, jumProduk: 0 };
            rankingW.push(this[a.sales_team]);
          }
          this[a.sales_team].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales_team].jumProduk += +a.jumProduk;
        }, Object.create(null));
        console.log('ranking', rankingW);
        this.rankingW = rankingW.concat();
        this.rankingW.sort(function (a, b) {
          return b.jumlah_bayaran - a.jumlah_bayaran;
        });

        console.log('weekrank', this.rankingW);
      });
    });
  }

  loadSalesRankMonthly() {
    return new Promise(resolve => {
      const body = {
        aksi: 'getrankingteammonthly',
        limit: this.limit,
        start: this.start,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesrankingM.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesrankingM);
        let rankingM = [];

        this.salesrankingM.forEach(function (a) {
          if (!this[a.sales_team]) {
            this[a.sales_team] = { sales_team: a.sales_team, jumlah_bayaran: 0, jumProduk: 0 };
            rankingM.push(this[a.sales_team]);
          }
          this[a.sales_team].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales_team].jumProduk += +a.jumProduk;
        }, Object.create(null));
        console.log('ranking', rankingM);
        this.rankingM = rankingM.concat();
        this.rankingM.sort(function (a, b) {
          return b.jumlah_bayaran - a.jumlah_bayaran;
        });

        console.log('weekrank', this.rankingM);
      });
    });
  }
}
