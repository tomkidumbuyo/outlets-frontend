import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { OrderByPipe } from './_pipes/order-by.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { NotAllowedComponent } from './not-allowed/not-allowed.component';
import { ChartsModule } from 'ng2-charts';
import { ClientHeaderComponent } from './client-header/client-header.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';



@NgModule({
  declarations: [HeaderComponent, FooterComponent, ConfirmationDialogComponent, OrderByPipe, NotAllowedComponent, ClientHeaderComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    RouterModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTreeModule,
    MatIconModule,
    GoogleMapsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
    ChartsModule,
    NgxIntlTelInputModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    CommonModule,
    BrowserModule,
    RouterModule,
    MatSnackBarModule,
    MatTreeModule,
    MatIconModule,
    GoogleMapsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    ConfirmationDialogComponent,
    OrderByPipe,
    MatButtonModule,
    MatProgressBarModule,
    ChartsModule,
    NgxIntlTelInputModule,
  ]
})
export class SharedModule { }
