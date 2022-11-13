import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  brand: any;
  brands: any[] = [];
  selectedBrand: any;
  private dataSource = new Subject();
  page: any = 'info';

  constructor(
    private restApiService: RestApiService,
  ) { }

  fetch() {
    console.log('fetching');
    this.restApiService.getAuth('brand')
    .then((brands: any[]) => {
      this.brands = brands;
      this.sendData();
    })
    .catch(error => {

    });
  }

  getProducts() {
    console.log('SELECTED BRAND PRODUCTS', this.selectedBrand);
    this.restApiService.getAuth('brand/products/' + this.selectedBrand._id)
    .then((products: any[]) => {
      this.selectedBrand.products = products;
      this.sendData();
    })
    .catch(error => {

    });
  }

 

  setPage(page) {
    console.log('set page', page);
    this.page = page;
    this.sendData();
  }

  getPage() {
    return this.page;
  }


  getDataObservable() {
    return this.dataSource;
  }

  selectBrand(brand){
    this.selectedBrand = brand;
    console.log('SELECTED BRAND', brand);
    this.getProducts();
    this.sendData();
  }

  sendData() {
    this.dataSource.next({
      brands: this.brands,
      page: this.page,
      brand: this.selectedBrand
    });
  }

}
