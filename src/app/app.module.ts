import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { E404Component } from './e404/e404.component';
import { SharedModule } from './shared/shared.module';
import { OutletsModule } from './outlets/outlets.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { MapModule } from './map/map.module';
import { CoreModule } from './core/core.module';
import { ClassificationsModule } from './classifications/classifications.module';
import { UserNotAllowedComponent } from './user-not-allowed/user-not-allowed.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { ClickStopPropagationDirective } from './_directives/click-stop-propagation.directive';
import { ChartsModule } from 'ng2-charts';
import { ProjectModule } from './project/project.module';
import { ClientModule } from './client/client.module';
import { BrandModule } from './brand/brand.module';
import { NoAccessModule } from './no-access/no-access.module';


@NgModule({
  declarations: [
    AppComponent,
    E404Component,
    UserNotAllowedComponent,
    ClickStopPropagationDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    CoreModule,
    SharedModule,
    OutletsModule,
    UsersModule,
    ProductsModule,
    ClassificationsModule,
    ProjectModule,
    ClientModule,
    BrandModule,
    MapModule,
    AuthModule,
    BrowserAnimationsModule,
    ChartsModule,
    NoAccessModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
