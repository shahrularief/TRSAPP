import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PostProvider } from '../../../providers/post-provider';
import { IonSlides } from '@ionic/angular';
const TOKEN_KEY = 'user-access-token';

@Component({
  selector: 'app-salesmember',
  templateUrl: './salesmember.page.html',
  styleUrls: ['./salesmember.page.scss'],
})
export class SalesmemberPage implements OnInit {
  salesranking: any[];
  ranking: any[];
  salesrankingW: any[];
  rankingW: any[];
  salesrankingM: any[];
  rankingM: any[];
  companies: any[];
  salesteam: string;
 

  slider1 = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
  };

  constructor(
    private postPrvdr: PostProvider,
    private storage: Storage, ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.salesranking = [];
    this.ranking = [];
    this.salesrankingW = [];
    this.rankingW = [];
    this.salesrankingM = [];
    this.rankingM = [];
    this.companies = [];
    this.loadTeam();
  }
  loadSalesRankToday(ev: CustomEvent) {
    this.clearArrayCustT();
    let val = ev.detail.value;

    return new Promise(resolve => {
      const body = {
        aksi: 'getrankingmemberstoday',
        company: val,
      
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesranking.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesranking);
        let ranking = [];

        this.salesranking.forEach(function (a) {
          if (!this[a.sales]) {
            this[a.sales] = { sales: a.sales, jumlah_bayaran: 0, jumProduk: 0 };
            ranking.push(this[a.sales]);
          }
          this[a.sales].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales].jumProduk += +a.jumProduk;
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

  loadSalesRankWeekly(ev: CustomEvent) {
    this.clearArrayCustW();
    let val = ev.detail.value;

    return new Promise(resolve => {
      const body = {
        aksi: 'getrankingmembersweekly',
        company: val,
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesrankingW.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesrankingW);
        let rankingW = [];

        this.salesrankingW.forEach(function (a) {
          if (!this[a.sales]) {
            this[a.sales] = { sales: a.sales, jumlah_bayaran: 0, jumProduk: 0 };
            rankingW.push(this[a.sales]);
          }
          this[a.sales].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales].jumProduk += +a.jumProduk;
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

  loadSalesRankMonthly(ev: CustomEvent) {
    this.clearArrayCustM();
    let val = ev.detail.value;

    return new Promise(resolve => {
      const body = {
        aksi: 'getrankingmembersmonthly',
        company: val,

      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesrankingM.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesrankingM);
        let rankingM = [];

        this.salesrankingM.forEach(function (a) {
          if (!this[a.sales]) {
            this[a.sales] = { sales: a.sales, jumlah_bayaran: 0, jumProduk: 0 };
            rankingM.push(this[a.sales]);
          }
          this[a.sales].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.sales].jumProduk += +a.jumProduk;
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

  clearArrayCustT() {
    this.salesranking = [];
  }
  clearArrayCustW() {
    this.salesrankingW.length = 0;
  
  }
  clearArrayCustM() {
    this.salesrankingM = [];
  }

  loadTeam() {
    return new Promise(resolve => {
      let body = {
        aksi: 'getcompany',
      
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (let comp of data.result) {
          this.companies.push(comp);
          

        }
        console.log(this.companies);
        resolve(true);
      });
    });
  }

}
