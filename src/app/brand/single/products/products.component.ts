import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/_services/brand.service';
import { ProductsService } from 'src/app/_services/products.service';
declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  brandObservarable: any;
  brand: any = {_id : 0};

  products = [];

  deleteVerification: string = '';

  deletedProduct = null;

  constructor(
    private brandService: BrandService,
    private productService: ProductsService
  ) {
      
      this.brandObservarable = this.brandService.getDataObservable();
      this.brandObservarable.subscribe(arg => {
        console.log('args', arg);
        this.brand = arg.brand;
      });
      this.brandService.fetch();
      brandService.setPage('products');
  }

  ngOnInit(): void {
  }

  deleteProduct() {
    if(this.deleteVerification == this.deletedProduct.name) {
      this.productService.deleteProduct(this.deletedProduct);
      $('#delete-product').modal('hide')
      this.brand.products.splice(this.brand.products.indexOf(this.brand.products.filter(prdct => this.deletedProduct._id == prdct._id)[0]),1);
    }
    
  }

  promptDeleteProduct(product) {
    this.deletedProduct = product;
    $('#delete-product').modal('show');
  }

}
