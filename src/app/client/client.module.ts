import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';
import { InfoComponent } from './single/info/info.component';
import { ProjectsComponent } from './single/projects/projects.component';
import { BrandsComponent } from './single/brands/brands.component';
import { SharedModule } from '../shared/shared.module';
import { NewProjectComponent } from './single/new-project/new-project.component';
import { SettingComponent } from './single/setting/setting.component';
import { MemberComponent } from './single/member/member.component';


@NgModule({
  declarations: [
    ClientComponent,
    AllComponent,
    SingleComponent,
    InfoComponent,
    ProjectsComponent,
    BrandsComponent,
    NewProjectComponent,
    InfoComponent,
    BrandsComponent,
    ProjectsComponent,
    SettingComponent,
    MemberComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule { }
