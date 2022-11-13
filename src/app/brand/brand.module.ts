import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';
import { InfoComponent } from './single/info/info.component';
import { ProductsComponent } from './single/products/products.component';
import { NewProductsComponent } from './single/new-products/new-products.component';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './single/settings/settings.component';


@NgModule({
  declarations: [BrandComponent, AllComponent, SingleComponent, InfoComponent, ProductsComponent, NewProductsComponent, SettingsComponent],
  imports: [
    CommonModule,
    BrandRoutingModule,
    SharedModule
  ]
})
export class BrandModule { }
