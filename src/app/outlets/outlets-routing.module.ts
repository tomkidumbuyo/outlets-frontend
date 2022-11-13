import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutletsComponent } from './outlets.component';
import { ListComponent } from './list/list.component';
import { InfoComponent } from './info/info.component';


const routes: Routes = [{
  path: '',
  redirectTo: 'outlet',
  pathMatch: 'full'
}, {
  path: 'outlet',
  component: OutletsComponent,
  children: [{
    path: '',
    component: ListComponent
  }, {
    path: ':id',
    component: InfoComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutletsRoutingModule { }
