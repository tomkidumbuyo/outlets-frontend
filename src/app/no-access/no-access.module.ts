import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoAccessRoutingModule } from './no-access-routing.module';
import { NoAccessComponent } from './no-access.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    NoAccessComponent
  ],
  imports: [
    CommonModule,
    NoAccessRoutingModule,
    SharedModule,
  ]
})

export class NoAccessModule { }
