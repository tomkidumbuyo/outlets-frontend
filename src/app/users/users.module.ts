import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { InfoComponent } from './info/info.component';
import { MapComponent } from './map/map.component';
import { UsersComponent } from './users.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ListComponent, InfoComponent, MapComponent, UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule { }
