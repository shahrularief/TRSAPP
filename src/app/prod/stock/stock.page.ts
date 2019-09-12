import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, ToastController } from "@ionic/angular";
import { PostProvider } from "../../../providers/post-provider";
import { ModalController } from "@ionic/angular";
@Component({
  selector: "app-stock",
  templateUrl: "./stock.page.html",
  styleUrls: ["./stock.page.scss"]
})
export class StockPage implements OnInit {
  products: any[];
  limit = 20; // LIMIT GET PERDATA
  start = 0;
  dinner: any;
  constructor(
    private router: Router,
    private postPrvdr: PostProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.products = [];
    this.start = 0;
    this.loadProduct();
  }

  onSearchTerm(ev: CustomEvent) {
    const val = ev.detail.value;

    if (val && val.trim() !== "") {
      this.products = this.products.filter(term => {
        return (
          term.prodName.toLowerCase().indexOf(val.trim().toLowerCase()) > -1
        );
      });
    } else {
      this.products = [];
      this.loadProduct();
    }
  }
  loadProduct() {
    return new Promise(resolve => {
      const body = {
        aksi: "getproduct",
        limit: this.limit,
        start: this.start
      };

      this.postPrvdr.postData(body, "process-api.php").subscribe(data => {
        for (const prod of data.result) {
          this.products.push(prod);
          console.log("Products:" + this.products);
        }
        resolve(true);
      });
    });
  }

  async openAddProduct() {
    const alert = await this.alertCtrl.create({
      header: "Tambah Produk",
      inputs: [
        {
          name: "prodName",
          type: "text",
          placeholder: "Nama Produk"
        },
        {
          name: "prodCode",
          type: "text",
          placeholder: "Kod Produk"
        },
        {
          name: "prodPrice",
          type: "number",
          placeholder: "Harga Produk"
        },
        {
          name: "prodStock",
          type: "number",
          placeholder: "Stok Produk"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Ok",
          handler: async data => {
            if (
              data.prodName !== "" &&
              data.prodCode !== "" &&
              data.prodPrice !== ""
            ) {
              console.log("Confirm Ok");
              this.newProduct(data);
              console.log(data);
            } else {
              const toast = await this.toastCtrl.create({
                message: "Isi ruang kosong",
                duration: 2000
              });
              toast.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async newProduct(data) {
    console.log(data);
    let body = {
      aksi: "addproduct",
      prodCode: data.prodCode,
      prodPrice: data.prodPrice,
      prodStock: data.prodStock,
      prodName: data.prodName
    };

    this.postPrvdr.postData(body, "process-api.php").subscribe(async data => {
      this.router.navigate(["/stock"]);
      console.log("OK");
      console.log(data);

      const toast = await this.toastCtrl.create({
        message: "PRODUK telah disimpan",
        duration: 2000
      });
      toast.present();
    });
  }

  async deleteOrder(id) {
    const alert = await this.alertCtrl.create({
      header: "Delete!",
      message: "Adakah anda pasti?",
      buttons: [
        {
          text: "Tidak",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Delete",
          handler: () => {
            this.delProduct(id);
            console.log("Confirm Okay");
          }
        }
      ]
    });

    await alert.present();
  }

  delProduct(id) {
    const body = {
      aksi: "deleteProd",
      prodID: id
    };
    this.postPrvdr.postData(body, "process-api.php").subscribe(data => {
      this.ionViewWillEnter();
    });
  }
}
