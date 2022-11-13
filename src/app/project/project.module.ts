import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';
import { SharedModule } from '../shared/shared.module';
import { InfoComponent } from './single/info/info.component';
import { MovementComponent } from './single/movement/movement.component';
import { TempComponent } from './single/temp/temp.component';
import { SettingsComponent } from './single/settings/settings.component';
import { DashboardComponent } from './single/dashboard/dashboard.component';
import { LocationComponent } from './single/temp/single/location/location.component';
import { VisitsComponent } from './single/temp/single/visits/visits.component';
import { AllComponent as TempAllComponent } from './single/temp/all/all.component';
import { SingleComponent as TempSingleComponent } from './single/temp/single/single.component';
import { VisitsComponent as TempVisitComponent } from './single/temp/single/visits/visits.component';
import { LocationComponent as TempLocationComponent } from './single/temp/single/location/location.component';
import { InfoComponent as TempInfoComponent } from './single/temp/single/info/info.component';
import { SettingComponent } from './single/temp/single/setting/setting.component';


@NgModule({
  declarations: [
    ProjectComponent, 
    AllComponent, 
    SingleComponent, 
    InfoComponent, 
    MovementComponent, 
    TempComponent, 
    SettingsComponent, 
    DashboardComponent, 
    LocationComponent, 
    VisitsComponent,
    TempAllComponent,
    TempSingleComponent,
    TempInfoComponent,
    TempVisitComponent,
    TempLocationComponent,
    SettingComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    SharedModule,
    BrowserModule,
  ]
})
export class ProjectModule { }
