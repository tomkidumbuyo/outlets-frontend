import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';


const routes: Routes = [{
  path: 'products',
  component: ProductsComponent,
  children: [{
    path: '',
    component: AllComponent,
  }, {
    path: ':id',
    component: SingleComponent,
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
