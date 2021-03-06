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
        aksi: 'getrankingcompanydaily',
     
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesranking.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesranking);
        let ranking = [];

        this.salesranking.forEach(function (a) {
          if (!this[a.company]) {
            this[a.company] = { company: a.company, jumlah_bayaran: 0, jumProduk: 0 };
            ranking.push(this[a.company]);
          }
          this[a.company].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.company].jumProduk += +a.jumProduk;
        }, Object.create(null));
        console.log('ranking', ranking);
        this.ranking = ranking.concat();
        for (let i = 0; i < this.ranking.length; i++) {
          this.ranking[i].jumlah_bayaran = parseFloat(this.ranking[i].jumlah_bayaran);
          this.ranking[i].jumlah_bayaran = this.ranking[i].jumlah_bayaran.toFixed(2);
          console.log(this.ranking[i].jumlah_bayaran)
        }
       
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
        aksi: 'getrankingcompanyweekly',
      
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesrankingW.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesrankingW);
        let rankingW = [];

        this.salesrankingW.forEach(function (a) {
          if (!this[a.company]) {
            this[a.company] = { company: a.company, jumlah_bayaran: 0, jumProduk: 0 };
            rankingW.push(this[a.company]);
          }
          this[a.company].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.company].jumProduk += +a.jumProduk;
        }, Object.create(null));
        console.log('ranking', rankingW);
        this.rankingW = rankingW.concat();
        for (let i = 0; i < this.rankingW.length; i++) {
          this.rankingW[i].jumlah_bayaran = parseFloat(this.rankingW[i].jumlah_bayaran);
          this.rankingW[i].jumlah_bayaran = this.rankingW[i].jumlah_bayaran.toFixed(2);
          console.log(this.rankingW[i].jumlah_bayaran)
        }
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
        aksi: 'getrankingcompanymonthly',
    
      };

      this.postPrvdr.postData(body, 'process-api.php').subscribe(data => {
        for (const sales of data.result) {
          this.salesrankingM.push(sales);
        }
        resolve(true);
        console.log('sales:' + this.salesrankingM);
        let rankingM = [];

        this.salesrankingM.forEach(function (a) {
          if (!this[a.company]) {
            this[a.company] = { company: a.company, jumlah_bayaran: 0, jumProduk: 0 };
            rankingM.push(this[a.company]);
          }
          this[a.company].jumlah_bayaran += +a.jumlah_bayaran;
          this[a.company].jumProduk += +a.jumProduk;
        }, Object.create(null));
        console.log('ranking', rankingM);
        this.rankingM = rankingM.concat();
        for (let i = 0; i < this.rankingM.length; i++) {
          this.rankingM[i].jumlah_bayaran = parseFloat(this.rankingM[i].jumlah_bayaran);
          this.rankingM[i].jumlah_bayaran = this.rankingM[i].jumlah_bayaran.toFixed(2);
          console.log(this.rankingM[i].jumlah_bayaran)
        }
        this.rankingM.sort(function (a, b) {
          return b.jumlah_bayaran - a.jumlah_bayaran;
        });

        console.log('weekrank', this.rankingM);
      });
    });
  }
}
