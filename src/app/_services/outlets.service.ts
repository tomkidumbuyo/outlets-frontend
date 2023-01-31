import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutletsService {

  outlets: any[] = [];
  filteredOutlets: any[] = [];
  searchedOutlets: any[] = [];
  loading = true;

  private dataSource: any = new Subject();

  private length = 0;
  private filteredLength = 0;
  private page = 0;
  private limit = 20;

  public query: string = null;

  public regionModel = null;
  public districtModel = null;
  public wardModel = null;
  public categoryModel = null;

  private pages = [];
  private offset: number;

  private allDataLoaded = false
  reload: boolean = false;
  classifications: any[];
  categories: any[];
  filteredOutletsUnpaginated: any[];

  constructor(
    public restApi: RestApiService,
  ) {
    this.setPage(0);
    this.loadAllData();
  }

  getData() {
    this.sendData();
    this.loadAllData();
  }

  loadAllData() {

    Promise.all([
      this.restApi.getAuth('outlet/'),
      this.restApi.getAuth('classification/classifications'),
      this.restApi.getAuth('classification/categories'),
    ]).then((datas: any[]) => {


      this.outlets = datas[0];
      this.classifications = datas[1].filter(data => data.for == 'outlet');
      this.categories = datas[2];
      for (const classification of this.classifications) {
        classification.parents = this.getParents(classification);
      }

      this.loading = false;
      this.filter();
      this.allDataLoaded = true;
      if(this.reload) {
        this.loadAllData();
      }
      this.reload = false;
    });
  }

  getParents(classification) {

    let c = classification;
    let parents = []
    while(c != null && c != undefined && c.category) {
        let cat = this.categories.filter(category => category._id == c.category)[0]
        c = this.classifications.filter(classification => classification._id == cat.classification)[0];
        parents.push(c);
    }
    return parents.reverse();
  }

  deleteOutlet(outlet) {
    return new Promise(async (resolve, reject) => {
      let i = this.outlets.indexOf(outlet);
      this.outlets.splice(i, 1);

      if(this.allDataLoaded) {
        this.filter();
      } else {
        this.filteredOutlets.splice(this.filteredOutlets.indexOf(outlet), 1);
        this.pagination();
        this.reload = true;
      }

      this.restApi.deleteAuth('outlet/' + outlet._id)
      .then((data: any) => {
        resolve(data);
      })
      .catch(err => {
        this.outlets.splice(i, 0, outlet)
        reject(err)
      });
    })
  }

  loadPartialData() {
    this.loading = true;
    this.offset = this.page * this.limit;
    this.restApi.getAuth('outlet/pagination/' + this.limit + '/' + (this.offset))
    .then((data: any[]) => {
        this.filteredOutlets = data;
        this.loading = false;
        this.pagination();
    })
    this.loading = true;
    this.restApi.getAuth('outlet/count')
    .then((data: any) => {
        this.length = data.count;
        this.pagination();
    })
    .catch(err => {

    });
  }

  setPage(page: number) {
    this.page = page;
    if (this.outlets.length <= 0) {
      this.loadPartialData();
    } else {
      this.filter();
    }
  }

  pagination() {
    this.filteredOutletsUnpaginated = this.filteredOutlets;
    this.pages = Array.from(Array(Math.ceil(this.filteredLength / this.limit)).keys());
    if (this.page > this.pages.length) {
      this.page = this.pages.length;
    } else if (this.page < 0) {
      this.page = 0;
    }

    this.offset = this.page * this.limit;
    if (this.filteredOutlets.length > 0) {
      this.filteredOutlets = this.filteredOutlets.slice(this.offset, this.offset + this.limit);
    }
    this.sendData();
  }

  setLimit(limit: number) {
    this.limit = limit;
    if (this.outlets.length <= 0) {
      this.loadPartialData();
    } else {
      this.filter();
    }
  }

  setLength(length: number) {
    this.length = length;
    this.filter();
  }

  search(query: string) {
    this.query = query;
    this.filter();
  }

  clearSearch() {
    this.query = null;
    this.filter();
  }

  setFilterVariables(variables: any) {
    this.regionModel = variables.regionModel;
    this.districtModel = variables.districtModel;
    this.wardModel = variables.wardModel;
    this.categoryModel = variables.categoryModel;
    this.query = variables.query;
    this.filter();
  }

  filter() {
    if (this.query) {
      this.filteredOutlets = this.outlets.filter(outlet => {
        if(
          outlet.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          outlet.owner.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          outlet.tin.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          outlet.brn.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          outlet.ward.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          outlet.district.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          outlet.region.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          outlet.phone.toLowerCase().indexOf(this.query.toLowerCase()) !== -1
        ){
          return outlet;
        }
        for (const classification of outlet.classifications) {
          if(classification.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1) {
            return outlet;
          }
        }
      });
    } else {
      this.filteredOutlets = this.outlets;
    }

    if(this.regionModel != null && this.districtModel == null && this.wardModel == null){
      this.filteredOutlets = this.filteredOutlets.filter(outlet => outlet.region._id == this.regionModel._id);
    }else if(this.regionModel != null && this.districtModel != null && this.wardModel == null){
      this.filteredOutlets = this.filteredOutlets.filter(outlet => outlet.district._id == this.districtModel._id);
    }else if(this.regionModel != null && this.districtModel != null && this.wardModel != null) {
      this.filteredOutlets = this.filteredOutlets.filter(outlet => outlet.ward._id == this.wardModel._id);
    }

    if(this.categoryModel != null){
      this.filteredOutlets = this.filteredOutlets.filter(outlet => {
        if(outlet.classifications.length > 0) {
          let parents = this.getParents(outlet.classifications[0])
          parents.push(outlet.classifications[0])
          if(parents.filter(classification => classification != null && classification._id == this.categoryModel._id).length > 0) {
            return outlet;
          }
        }
      });
    }

    this.filteredLength = this.filteredOutlets.length;
    this.pagination();
  }



  getDataObservable() {
    return this.dataSource;
  }

  sendData() {
    this.dataSource.next({
      outlets: this.outlets,
      filteredOutlets: this.filteredOutlets,
      loading: this.loading,
      pages: this.pages,
      length: this.length,
      filteredLength: this.filteredLength,
      page: this.page,
      offset: this.offset,
      limit: this.limit,
      query: this.query,
      regionModel: this.regionModel,
      districtModel: this.districtModel,
      wardModel: this.wardModel,
      categoryModel: this.categoryModel,
      classifications: this.classifications,
      filteredOutletsUnpaginated: this.filteredOutletsUnpaginated
    });
  }


}
