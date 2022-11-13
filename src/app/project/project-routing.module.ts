import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllComponent } from './all/all.component';
import { SingleComponent } from './single/single.component';
import { ProjectComponent } from './project.component';
import { InfoComponent } from './single/info/info.component';
import { MovementComponent } from './single/movement/movement.component';
import { TempComponent } from './single/temp/temp.component';
import { SettingsComponent } from './single/settings/settings.component';
import { DashboardComponent } from './single/dashboard/dashboard.component';
import { AllComponent as TempAllComponent } from './single/temp/all/all.component';
import { SingleComponent as TempSingleComponent } from './single/temp/single/single.component';
import { VisitsComponent as TempVisitComponent } from './single/temp/single/visits/visits.component';
import { LocationComponent as TempLocationComponent } from './single/temp/single/location/location.component';
import { InfoComponent as TempInfoComponent } from './single/temp/single/info/info.component';
import { SettingComponent as TempSettingComponent } from './single/temp/single/setting/setting.component';


const routes: Routes = [{
  path: 'project',
  component: ProjectComponent,
  children: [{
    path: '',
    component: AllComponent,
  }, {
    path: ':id',
    component: SingleComponent,
    children: [{
      path: '',
      component: DashboardComponent
    }, {
      path: 'info',
      component: InfoComponent
    }, {
      path: 'movement',
      component: MovementComponent
    }, {
      path: 'temps',
      component: TempComponent,
      children: [{
        path: '',
        component: TempAllComponent
      }, {
        path: ':id',
        component: TempSingleComponent,
        children: [{
          path: '',
          component: TempInfoComponent
        }, {
          path: 'visits',
          component: TempVisitComponent
        }, {
          path: 'location',
          component: TempLocationComponent
        }, {
          path: 'setting',
          component: TempSettingComponent
        }]
      }]
    }, {
      path: 'settings',
      component: SettingsComponent
    }]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
