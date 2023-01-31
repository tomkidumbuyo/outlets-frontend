import { Component, OnInit } from '@angular/core';
import { OutletsService } from 'src/app/_services/outlets.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { RestApiService } from '../../_services/rest-api.service';




@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  outletObservarable: any;
  outlets: any[] = [];

  d = new Date();
  hh = ('0' + Math.abs((this.d.getTimezoneOffset() - (this.d.getTimezoneOffset() % 60)) / 60)).slice(-2);
  mm = ('0' +  Math.abs(this.d.getTimezoneOffset() % 60)).slice(-2);
  tz = this.d.getTimezoneOffset() > 0 ? '-' + this.hh + this.mm : '+' + this.hh + this.mm;

  loading: boolean = true;
  pages: number[] = [0];
  page: number = 0;
  filteredOutlets: any[] = [];
  length: number = 0;
  filteredLength: number = 0;
  offset: number = 0;
  limit: number  = 0;
  paginationSliceStart: number = 0;
  paginationSliceEnd: number = 6;
  paginationPages: number[] = [];

  regionModel: any = null;
  districtModel: any = null;
  wardModel: any = null;
  queryModel = null;


  regions = [];
  districts = [];
  wards = [];
  filteredDistricts = [];
  filteredWards = [];

  classificationModel = null;
  categoryModel: any;
  categories: any[];
  classifications: any[];


  constructor(
    private outletService: OutletsService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private restApi: RestApiService,
  ) {

    this.selectPage(0);

    this.outletService.getData();
    this.outletObservarable = outletService.getDataObservable();
    this.outletObservarable.subscribe(arg => {

      this.outlets = arg.outlets;
      this.loading = arg.loading;
      this.pages = arg.pages;
      this.filteredOutlets = arg.filteredOutlets;
      this.page = arg.page;
      this.length = arg.length;
      this.filteredLength = arg.filteredLength
      this.offset = arg.offset;
      this.limit = arg.limit;

      this.regionModel = arg.regionModel;
      this.districtModel = arg.districtModel;
      this.wardModel = arg.wardModel;
      this.classifications = arg.classifications;

      this.paginationSliceStart = this.page - 3 > 0 ? this.page - 3 : 0 ;
      this.paginationSliceEnd = this.page + 4 < this.pages.length ? this.page + 4 : this.pages.length ;
      this.paginationPages = this.pages.slice(this.paginationSliceStart, this.paginationSliceEnd);

    });

    this.loadLocations();

  }

  ngOnInit(): void {

  }

  loadLocations() {

    this.restApi.getAuth('assets/regions')
    .then((data: any[]) => {
      this.regions = data;
    })
    .catch(err => {

    });

    this.restApi.getAuth('assets/districts')
    .then((data: any[]) => {
      this.districts = data;
    })
    .catch(err => {

    });

    this.restApi.getAuth('assets/wards')
    .then((data: any[]) => {
      this.wards = data;
    })
    .catch(err => {

    });

  }



  selectRegion(region){
    this.regionModel = region;
    this.districtModel = null;
    this.wardModel = null;
    this.filteredDistricts = region != null ? this.districts.filter(district => district.region == region._id) : this.districts ;
    this.setServiceFilters();
  }

  selectDistrict(district){
    this.districtModel = district;
    this.wardModel = null;
    this.filteredWards = this.wards.filter(ward => ward.district == district._id)
    this.setServiceFilters();
  }

  selectWard(ward){
    this.wardModel = ward;
    this.setServiceFilters();
  }

  selectCategory(category){
    this.categoryModel = category;
    this.setServiceFilters();
  }

  setServiceFilters() {
    this.outletService.setFilterVariables({
      regionModel : this.regionModel,
      districtModel : this.districtModel,
      wardModel : this.wardModel,
      categoryModel : this.categoryModel,
      query : this.queryModel == "" ? null : this.queryModel,
    });
  }

  selectPage(page) {
    this.outletService.setPage(page);
  }

  deleteOutlet(outlet) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of ' + outlet.name + 'name'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.outletService.deleteOutlet(outlet)
        .then(data => {
          this.snackBar.open('Outlet deleted succesfully.', 'Close', {
            verticalPosition: 'top'
          });
        })
        .catch(err => {
          this.snackBar.open('Error deleting outlet.' + err, 'Close', {
            verticalPosition: 'top'
          });
        })
      }
    });
  }

}
