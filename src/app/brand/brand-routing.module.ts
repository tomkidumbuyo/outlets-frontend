import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandComponent } from './brand.component';
import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';
import { InfoComponent } from './single/info/info.component';
import { ProductsComponent } from './single/products/products.component';
import { NewProductsComponent } from './single/new-products/new-products.component';
import { SettingsComponent } from './single/settings/settings.component';


const routes: Routes = [{
  path: 'brand',
  component: BrandComponent,
  children: [{
    path: '',
    component: AllComponent,
  }, {
    path: ':id',
    component: SingleComponent,
    children: [{
      path: '',
      // component: InfoComponent
      component: ProductsComponent
    }, {
      path: 'products',
      component: ProductsComponent
    }, {
      path: 'setting',
      component: SettingsComponent
    }, {
      path: 'newproduct',
      component: NewProductsComponent
    },  {
      path: 'newproduct/:id',
      component: NewProductsComponent
    }]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
