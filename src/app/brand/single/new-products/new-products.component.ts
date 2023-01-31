import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/_services/brand.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ClassificationService } from 'src/app/_services/classification.service';
import { ProductsService } from 'src/app/_services/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from 'src/app/_services/rest-api.service';


@Component({
  selector: 'app-new-products',
  templateUrl: './new-products.component.html',
  styleUrls: ['./new-products.component.scss']
})
export class NewProductsComponent implements OnInit {

  brandObservarable: any;
  brand: any;
  newProductForm: any;
  phones: FormArray;
  classificationObservarable: any;
  categoriesArray = [];
  parentCategoriesArray = [];
  selectedClasses: any[] = [];
  classifications: any;
  id: String = null;
  product: any;
  savingRequest: boolean = false;

  constructor(
    private brandService: BrandService,
    private classificationService: ClassificationService,
    private snackBar: MatSnackBar,
    private productsService: ProductsService,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private restApiService: RestApiService
  ) {

      this.brandObservarable = this.brandService.getDataObservable();
      this.brandObservarable.subscribe(arg => {

        this.brand = arg.brand;
      });
      brandService.setPage('products');


      this.classificationObservarable = this.classificationService.getDataObservable();
      this.classificationObservarable.subscribe(arg => {

        this.classifications = arg.classifications;
        this.categoriesArray = [{
          name: 'Main Category',
          children: arg.classifications
        }];

      });
      classificationService.selectType('product');

      this.newProductForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        price: new FormControl('', [Validators.required]),
        skus: this.fb.array([]) ,
      });
      this.addSkus();
  }

  ngOnInit(): void {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');


    if(this.id) {
      this.savingRequest = true
      this.restApiService.getAuth('product/' + this.id)
      .then((product: any) => {
        this.product = product;
        this.newProductForm.controls['name'].setValue(product.name);
        for (const sku of this.product.skus) {
          this.skus.push(this.fb.group({
            sku: sku.sku,
            price: sku.price,
          }))
        }
        this.removeSku(0);

        for (const classification of this.product.classifications) {
          this.selectedClasses.push(classification);
        }

        this.savingRequest = false
      })
      .catch(error => {

      });
    }

  }

  get skus() : FormArray {
    return this.newProductForm.get("skus") as FormArray
  }



  newSku(): FormGroup {
    return this.fb.group({
      sku: '',
      price: '',
    })
  }

 addSkus() {
  this.skus.push(this.newSku());
 }

 removeSku(i:number) {
  this.skus.removeAt(i);
  if(this.skus.length == 0) {
    this.addSkus();
  }
}

  refreshClass(current, parent) {
    this.categoriesArray = [{
      name: 'Main Category',
      children: this.classifications
    }];
  }

  selectClass(current, parent) {

    const i = this.categoriesArray.indexOf(parent);
    this.categoriesArray.splice(i, 1);



    if (current.children.length > 0) {
      for (const child of current.children) {
        child.parent = parent;
        this.categoriesArray.splice(i, 0, child);
      }
    } else {
      if (this.selectedClasses.indexOf(current) > -1) {
        this.snackBar.open('this category is already added', 'ok', {
          duration: 2000,
        });
      } else {
        this.selectedClasses.push(current);
      }
    }

    if (this.categoriesArray.length == 0) {
      this.categoriesArray = [{
        name: 'Main Category',
        children: this.classifications
      }];
    }
    this.parentCategoriesArray.push(parent);
  }

  parentCategory(category) {
    if (category.parent) {
      let i = this.categoriesArray.length - 1;
      for (const cat of this.categoriesArray) {
        if (cat.parent._id == category.parent._id) {
          i = i > this.categoriesArray.indexOf(cat) ?  this.categoriesArray.indexOf(cat) : i ;
          this.categoriesArray.splice(i, 0, [category.parent]);
        }
      }
    }
  }

  unselectClassification(classification) {
    this.selectedClasses.splice(this.selectedClasses.indexOf(classification), 1);
  }


  saveProduct() {



    const data = this.newProductForm.value;
    data.classifications = this.selectedClasses;
    data.brand = this.brand._id;

    if(this.product) {
      data._id = this.product._id;
    }

    if (data.classifications.length == 0) {
      this.snackBar.open('Please add categories', 'ok', {
        duration: 2000,
      });
    } else if (data.skus.length == 0) {
      this.snackBar.open('Please add SKU', 'ok', {
        duration: 2000,
      });
    } else if (data.name.length == 0) {
      this.snackBar.open('Please add name', 'ok', {
        duration: 2000,
      });
    } else {
      this.savingRequest = true;
      this.productsService.createProduct(data)
      .then(product => {
        this.router.navigate(['brand/' + this.brand._id + '/products']);
        this.savingRequest = false;
        this.brandService.getProducts();
      })
      .catch(err => {
        this.snackBar.open('Error adding product', 'ok', {
          duration: 2000,
        });
        this.savingRequest = false;
      });
    }
  }



}
