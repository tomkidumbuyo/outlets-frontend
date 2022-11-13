import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassificationsRoutingModule } from './classifications-routing.module';
import { ClassificationsComponent } from './classifications.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ClassificationsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ClassificationsRoutingModule
  ]
})
export class ClassificationsModule { }
