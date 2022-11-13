import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { E404Component } from './e404/e404.component';
import { LoginComponent } from './auth/login/login.component';
//import { NotAllowedComponent } from './shared/not-allowed/not-allowed.component';


const routes: Routes = [{
  path: 'auth',
  component: LoginComponent
// }, {
//   path: 'notAllowed',
//   component: NotAllowedComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
