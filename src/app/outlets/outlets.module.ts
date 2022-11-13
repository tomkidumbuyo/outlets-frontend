import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutletsRoutingModule } from './outlets-routing.module';
import { ListComponent } from './list/list.component';
import { InfoComponent } from './info/info.component';
import { OutletsComponent } from './outlets.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ListComponent, InfoComponent, OutletsComponent],
  imports: [
    CommonModule,
    OutletsRoutingModule,
    SharedModule,
 
  ]
})
export class OutletsModule { }
