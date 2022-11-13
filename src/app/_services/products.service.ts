import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  

  products: any[] = [];
  private dataSource = new Subject();

  constructor(
    private restApiService: RestApiService,
  ) {
    this.fetch();
  }

  fetch() {
   
    this.restApiService.getAuth('product')
    .then((products: any[]) => {
      this.products = products;
      this.sendData();
    })
    .catch(error => {

    });
  }

  deleteProduct(product: any) {
    this.restApiService.deleteAuth('product/' + product._id)
    .then((products: any[]) => {
      this.fetch();
    })
    .catch(error => {

    });
  }

  getDataObservable() {
    return this.dataSource;
  }

  sendData() {
    this.dataSource.next({
      products: this.products
    });
  }

  createProduct(data) {
    return new Promise ((res, rej) => {
      if(data._id) {
        this.restApiService.putAuth('product/' + data._id, data)
        .then(product => {
          this.fetch();
          res(product);
        })
        .catch(err => {
          rej(err);
        });
      } else {
        this.restApiService.postAuth('product/create', data)
        .then(product => {
          this.products.push(product);
          res(product);
          this.sendData();
        })
        .catch(err => {
          rej(err);
        });
      }
    })
  }

}
