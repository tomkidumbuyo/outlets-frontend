import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { InfoComponent } from './info/info.component';
import { UsersComponent } from './users.component';


const routes: Routes = [{
  path: 'users',
  component: UsersComponent,
  children: [{
    path: '',
    component: ListComponent
  }]
}, {
  path: 'user/:id',
  component: InfoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
