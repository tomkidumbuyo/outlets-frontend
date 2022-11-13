import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassificationsComponent } from './classifications.component';


const routes: Routes = [{
  path: 'classification',
  component: ClassificationsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassificationsRoutingModule { }
