import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAccessComponent } from './no-access.component';



const routes: Routes = [
  {
    path: 'no-access',
    component: NoAccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoAccessRoutingModule { }
