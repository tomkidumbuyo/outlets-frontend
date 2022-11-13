import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/_services/products.service';
declare var $: any;

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllComponent implements OnInit {
  
  productObservarable: any;
  products: any;

  deleteVerification: string = '';

  deletedProduct = null;

  constructor(
    private productService: ProductsService
  ) {

    this.productObservarable = this.productService.getDataObservable();
    this.productObservarable.subscribe(arg => {
      this.products = arg.products;
    });

  }

  ngOnInit(): void {

  }

  deleteProduct() {
    if(this.deleteVerification == this.deletedProduct.name) {
      this.productService.deleteProduct(this.deletedProduct);
      $('#delete-product').modal('hide')
      this.products.splice(this.products.indexOf(this.products.filter(prdct => this.deletedProduct._id == prdct._id)[0]),1);
    }
    
  }

  promptDeleteProduct(product) {
    this.deletedProduct = product;
    $('#delete-product').modal('show');
  }


}
