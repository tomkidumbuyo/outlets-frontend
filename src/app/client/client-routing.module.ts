import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client.component';
import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';
import { InfoComponent } from './single/info/info.component';
import { BrandsComponent } from './single/brands/brands.component';
import { ProjectsComponent } from './single/projects/projects.component';
import { NewProjectComponent } from './single/new-project/new-project.component';
import { SettingComponent } from './single/setting/setting.component';
import { MemberComponent } from './single/member/member.component';



const routes: Routes = [{
  path: 'client',
  component: ClientComponent,
  children: [{
    path: '',
    component: AllComponent,
  }, {
    path: ':id',
    component: SingleComponent,
    children: [{
      path: '',
      component: InfoComponent
    }, {
      path: 'brands',
      component: BrandsComponent
    }, {
      path: 'projects',
      component: ProjectsComponent
    }, {
      path: 'newproject',
      component: NewProjectComponent
    }, {
      path: 'newproject/:id',
      component: NewProjectComponent
    }, {
      path: 'members',
      component: MemberComponent
    }, {
      path: 'settings',
      component: SettingComponent
    }]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
