import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { E404Component } from '../e404/e404.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
